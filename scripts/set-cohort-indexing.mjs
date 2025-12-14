/**
 * Set Cohort Indexing Script
 *
 * Flips indexingStatus to 'INDEX' ONLY for the 200 launch cohort slugs.
 * Does NOT touch any other rows in the database.
 *
 * Usage:
 *   node scripts/set-cohort-indexing.mjs --dry-run   # Preview changes
 *   node scripts/set-cohort-indexing.mjs --apply     # Apply changes
 *
 * Safety:
 *   - Only modifies rows where slug is in the cohort set
 *   - Uses updateMany with WHERE clause for atomic operation
 *   - Writes audit log to data/index-flip-report.json
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

/**
 * Parse cohort slugs from launch-cohort.ts between sentinel comments
 */
function parseCohortSlugs() {
  const filePath = path.join(__dirname, '..', 'src', 'lib', 'launch-cohort.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract content between COHORT_START and COHORT_END
  const startMarker = '// COHORT_START';
  const endMarker = '// COHORT_END';

  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error('Could not find COHORT_START/COHORT_END markers in launch-cohort.ts');
  }

  const cohortBlock = content.substring(startIdx, endIdx);

  // Match quoted slugs: 'slug-name' or "slug-name"
  const slugRegex = /['"]([a-z0-9-]+)['"]/g;
  const slugs = [];
  let match;

  while ((match = slugRegex.exec(cohortBlock)) !== null) {
    slugs.push(match[1].toLowerCase());
  }

  // Dedupe
  return [...new Set(slugs)];
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const isApply = args.includes('--apply');

  if (!isDryRun && !isApply) {
    console.log('Usage:');
    console.log('  node scripts/set-cohort-indexing.mjs --dry-run   # Preview changes');
    console.log('  node scripts/set-cohort-indexing.mjs --apply     # Apply changes');
    process.exit(1);
  }

  console.log('📋 Set Cohort Indexing Script');
  console.log(`Mode: ${isDryRun ? 'DRY RUN (no changes)' : 'APPLY (will modify database)'}`);
  console.log('');

  // Step 1: Parse cohort slugs
  console.log('1️⃣ Parsing cohort slugs from launch-cohort.ts...');
  const cohortSlugs = parseCohortSlugs();
  console.log(`   ✅ Loaded ${cohortSlugs.length} cohort slugs`);

  // Step 2: Count current state
  console.log('');
  console.log('2️⃣ Checking current database state...');

  const currentIndexCount = await prisma.deal.count({
    where: { indexingStatus: 'INDEX' }
  });

  const currentNoindexCount = await prisma.deal.count({
    where: { indexingStatus: 'NOINDEX' }
  });

  const cohortCurrentState = await prisma.deal.findMany({
    where: { slug: { in: cohortSlugs } },
    select: {
      slug: true,
      indexingStatus: true,
      retired: true,
      retirement: true
    }
  });

  console.log(`   Current INDEX count: ${currentIndexCount}`);
  console.log(`   Current NOINDEX count: ${currentNoindexCount}`);
  console.log(`   Cohort slugs found in DB: ${cohortCurrentState.length}/${cohortSlugs.length}`);

  // Count how many cohort slugs need updating
  const needsUpdate = cohortCurrentState.filter(d =>
    d.indexingStatus !== 'INDEX' || d.retired !== false || d.retirement !== 'NONE'
  );
  const alreadyCorrect = cohortCurrentState.filter(d =>
    d.indexingStatus === 'INDEX' && d.retired === false && d.retirement === 'NONE'
  );

  console.log(`   Already correct: ${alreadyCorrect.length}`);
  console.log(`   Need update: ${needsUpdate.length}`);

  // Missing slugs (in cohort but not in DB)
  const foundSlugs = new Set(cohortCurrentState.map(d => d.slug.toLowerCase()));
  const missingSlugs = cohortSlugs.filter(s => !foundSlugs.has(s));
  if (missingSlugs.length > 0) {
    console.log(`   ⚠️  Missing from DB (${missingSlugs.length}): ${missingSlugs.slice(0, 5).join(', ')}${missingSlugs.length > 5 ? '...' : ''}`);
  }

  // Step 3: Apply or preview
  console.log('');
  if (isDryRun) {
    console.log('3️⃣ DRY RUN - No changes will be made');
    console.log('');
    console.log('Would update the following:');
    console.log(`   • Set indexingStatus = 'INDEX' for ${cohortSlugs.length} slugs`);
    console.log(`   • Set retired = false for ${cohortSlugs.length} slugs`);
    console.log(`   • Set retirement = 'NONE' for ${cohortSlugs.length} slugs`);
    console.log('');
    console.log('After applying:');
    console.log(`   Expected INDEX count: ~${currentIndexCount + needsUpdate.length}`);
    console.log(`   Expected NOINDEX count: ~${currentNoindexCount - needsUpdate.filter(d => d.indexingStatus === 'NOINDEX').length}`);
  } else {
    console.log('3️⃣ APPLYING changes...');

    // Use updateMany for atomic operation
    const result = await prisma.deal.updateMany({
      where: { slug: { in: cohortSlugs } },
      data: {
        indexingStatus: 'INDEX',
        retired: false,
        retirement: 'NONE'
      }
    });

    console.log(`   ✅ Updated ${result.count} rows`);

    // Verify final state
    const finalIndexCount = await prisma.deal.count({
      where: { indexingStatus: 'INDEX' }
    });

    const finalNoindexCount = await prisma.deal.count({
      where: { indexingStatus: 'NOINDEX' }
    });

    console.log('');
    console.log('4️⃣ Final state:');
    console.log(`   INDEX count: ${finalIndexCount}`);
    console.log(`   NOINDEX count: ${finalNoindexCount}`);

    // Write audit report
    const report = {
      timestamp: new Date().toISOString(),
      mode: 'apply',
      cohortSlugsCount: cohortSlugs.length,
      cohortSlugs: cohortSlugs,
      beforeState: {
        indexCount: currentIndexCount,
        noindexCount: currentNoindexCount,
        cohortFoundInDb: cohortCurrentState.length,
        alreadyCorrect: alreadyCorrect.length,
        needsUpdate: needsUpdate.length
      },
      afterState: {
        indexCount: finalIndexCount,
        noindexCount: finalNoindexCount,
        rowsUpdated: result.count
      },
      missingSlugs: missingSlugs
    };

    const reportPath = path.join(__dirname, '..', 'data', 'index-flip-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`   📄 Audit report written to: data/index-flip-report.json`);
  }

  console.log('');
  console.log('✅ Done!');
}

main()
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

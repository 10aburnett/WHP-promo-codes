/**
 * Verify Launch Cohort Script
 *
 * Parses src/lib/launch-cohort.ts and validates:
 * - Exactly 200 slugs
 * - No duplicates
 * - All slugs pass quality checks
 *
 * Usage: node scripts/verify-launch-cohort.mjs
 * Exit code: 0 = pass, 1 = fail
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const EXPECTED_COUNT = 200;

function main() {
  console.log('🔍 Verifying launch cohort...\n');

  const filePath = join(__dirname, '..', 'src', 'lib', 'launch-cohort.ts');
  const content = readFileSync(filePath, 'utf8');

  // Extract slugs from the Set definition
  const setMatch = content.match(/LAUNCH_COHORT_SLUGS = new Set<string>\(\[\s*([\s\S]*?)\s*\]\)/);
  if (!setMatch) {
    console.error('❌ Could not find LAUNCH_COHORT_SLUGS Set in file');
    process.exit(1);
  }

  const setContent = setMatch[1];
  const slugMatches = setContent.match(/'([^']+)'/g);

  if (!slugMatches) {
    console.error('❌ No slugs found in Set');
    process.exit(1);
  }

  const slugs = slugMatches.map(s => s.replace(/'/g, ''));
  const uniqueSlugs = [...new Set(slugs)];

  console.log(`📊 Total slug entries: ${slugs.length}`);
  console.log(`📊 Unique slugs: ${uniqueSlugs.length}`);

  let hasErrors = false;

  // Check for duplicates
  if (slugs.length !== uniqueSlugs.length) {
    console.error(`\n❌ DUPLICATES FOUND: ${slugs.length - uniqueSlugs.length} duplicate entries`);

    // Find duplicates
    const seen = new Set();
    const duplicates = [];
    slugs.forEach(s => {
      if (seen.has(s)) {
        duplicates.push(s);
      }
      seen.add(s);
    });
    console.error('   Duplicates:', duplicates.join(', '));
    hasErrors = true;
  } else {
    console.log('✅ No duplicates');
  }

  // Check count
  if (uniqueSlugs.length !== EXPECTED_COUNT) {
    console.error(`\n❌ COUNT MISMATCH: Expected ${EXPECTED_COUNT}, got ${uniqueSlugs.length}`);
    hasErrors = true;
  } else {
    console.log(`✅ Exactly ${EXPECTED_COUNT} slugs`);
  }

  // Check slug quality (basic checks)
  const qualityIssues = [];
  uniqueSlugs.forEach(slug => {
    if (slug.length < 8) {
      qualityIssues.push(`${slug}: too short (${slug.length} chars)`);
    }
    if (slug.startsWith('-') || slug.endsWith('-')) {
      qualityIssues.push(`${slug}: leading/trailing hyphen`);
    }
    if (slug.includes('--')) {
      qualityIssues.push(`${slug}: repeated hyphens`);
    }
  });

  if (qualityIssues.length > 0) {
    console.error(`\n❌ QUALITY ISSUES: ${qualityIssues.length} slugs have problems`);
    qualityIssues.slice(0, 10).forEach(issue => console.error(`   - ${issue}`));
    if (qualityIssues.length > 10) {
      console.error(`   ... and ${qualityIssues.length - 10} more`);
    }
    hasErrors = true;
  } else {
    console.log('✅ All slugs pass quality checks');
  }

  // Summary
  console.log('');
  if (hasErrors) {
    console.error('❌ VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('✅ VERIFICATION PASSED');
    process.exit(0);
  }
}

main();

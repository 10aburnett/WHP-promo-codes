import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const batch20Slugs = [
  'lux-nomads-essentials',
  'innova-trade-ai',
  'devvy'
];

async function main() {
  const products = await prisma.deal.findMany({
    where: { slug: { in: batch20Slugs } },
    select: { slug: true, name: true, aboutContent: true, whopCategory: true }
  });

  console.log('Batch 20 (FINAL) - Last 3 products for ChatGPT:\n');
  products.forEach(p => {
    console.log('Slug:', p.slug);
    console.log('Name:', p.name);
    console.log('Category:', p.whopCategory);
    console.log('About:', (p.aboutContent || '').substring(0, 200) + '...');
    console.log('---');
  });
}

main().finally(() => prisma.$disconnect());

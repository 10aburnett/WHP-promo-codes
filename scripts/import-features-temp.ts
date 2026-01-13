import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const url = process.env.DATABASE_URL || '';
  const isBackup = url.includes('ep-rough-rain');
  console.log('Database:', isBackup ? '✅ BACKUP (ep-rough-rain)' : '❌ PRODUCTION');
  
  if (!isBackup) {
    throw new Error('Not connected to backup database! Aborting.');
  }

  const updates = [
    { slug: 'dodgys-dungeon', name: "Dodgy's Dungeon" },
    { slug: 'goat-sports-bets-membership', name: 'GOAT Sports Bets' },
    { slug: 'larrys-lounge-premium', name: "Larry's Lounge" }
  ];

  for (const u of updates) {
    const deal = await prisma.deal.findFirst({ where: { slug: u.slug }, select: { slug: true, name: true } });
    console.log(u.slug + ':', deal ? '✅ EXISTS' : '❌ NOT FOUND');
  }
  
  console.log('\nReady to update. Run with actual content.');
}

main().catch(console.error).finally(() => prisma.$disconnect());

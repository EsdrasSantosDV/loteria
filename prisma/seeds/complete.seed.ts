import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { seedData, loadJsonData } from './seed-helper';

const prisma = new PrismaClient();

async function main() {
  const games = loadJsonData<
    Array<{
      id: string;
      code: string;
      name: string;
      description?: string;
    }>
  >('data/lottery-game-definitions.json');

  await seedData(prisma, {
    model: 'lottery_game_definition',
    data: games,
    uniqueField: 'id',
    logPrefix: 'Jogo',
  });
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

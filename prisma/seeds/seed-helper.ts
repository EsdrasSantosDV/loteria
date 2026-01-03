import { PrismaClient } from '../../generated/prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export interface SeedOptions<T> {
  model: keyof PrismaClient;
  data: T[];
  uniqueField?: keyof T;
  logPrefix?: string;
}

/**
 * Função genérica para executar seeds de qualquer modelo do Prisma
 * @param prisma Instância do PrismaClient
 * @param options Opções de configuração do seed
 */
export async function seedData<T extends Record<string, any>>(
  prisma: PrismaClient,
  options: SeedOptions<T>,
): Promise<void> {
  const { model, data, uniqueField = 'id', logPrefix = 'Item' } = options;

  console.log(`🌱 Iniciando seed de ${String(model)}...`);

  const modelClient = prisma[model] as any;

  for (const item of data) {
    const uniqueValue = item[uniqueField];

    try {
      // Verifica se o item já existe
      const existing = await modelClient.findUnique({
        where: { [uniqueField]: uniqueValue },
      });

      if (existing) {
        console.log(
          `⏭️  ${logPrefix} ${item.name || item.code || uniqueValue} (${uniqueValue}) já existe, pulando...`,
        );
        continue;
      }

      // Cria o item
      await modelClient.create({
        data: item,
      });

      console.log(
        `✅ ${logPrefix} ${item.name || item.code || uniqueValue} (${uniqueValue}) criado com sucesso!`,
      );
    } catch (error) {
      console.error(`❌ Erro ao processar ${logPrefix} ${uniqueValue}:`, error);
      throw error;
    }
  }

  console.log(`🎉 Seed de ${String(model)} concluído!`);
}

/**
 * Carrega dados de um arquivo JSON
 * @param filePath Caminho relativo ao diretório de seeds
 */
export function loadJsonData<T>(filePath: string): T {
  const fullPath = path.join(__dirname, filePath);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

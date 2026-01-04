import { z } from 'zod';

export const GetLotteryDefinitionsSchema = z.object({
  search: z.string().optional(),
  page: z.number().int('page deve ser inteiro').positive('page deve ser > 0'),
  pageSize: z
    .number()
    .int('pageSize deve ser inteiro')
    .positive('pageSize deve ser > 0'),
});

export type GetLotteryDefinitionsInput = z.infer<
  typeof GetLotteryDefinitionsSchema
>;

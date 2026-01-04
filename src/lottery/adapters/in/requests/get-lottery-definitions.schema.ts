import { z } from 'zod';

export const GetLotteryDefinitionsSchema = z.object({
  search: z.string().optional(),
  page: z.coerce
    .number()
    .int('page deve ser inteiro')
    .min(0, 'page deve ser >= 0'),
  pageSize: z.coerce
    .number()
    .int('pageSize deve ser inteiro')
    .positive('pageSize deve ser > 0'),
});

export type GetLotteryDefinitionsInput = z.infer<
  typeof GetLotteryDefinitionsSchema
>;

import { z } from 'zod';

export const CreateLotteryDrawSchema = z.object({
  gameId: z.string().min(1, 'gameId é obrigatório'),
  contestNumber: z
    .number()
    .int('contestNumber deve ser inteiro')
    .positive('contestNumber deve ser > 0'),
  scheduledAt: z.iso.datetime('scheduledAt deve ser ISO datetime').optional(),
});

export type CreateLotteryDrawInput = z.infer<typeof CreateLotteryDrawSchema>;

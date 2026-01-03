import { z } from 'zod';

export const CreateLotteryBetSchema = z.object({
  drawId: z.string().min(1, 'drawId é obrigatório'),
  numbers: z
    .array(z.number().int('Números devem ser inteiros'))
    .min(1, 'Números são obrigatórios'),
});

export type CreateLotteryBetInput = z.infer<typeof CreateLotteryBetSchema>;

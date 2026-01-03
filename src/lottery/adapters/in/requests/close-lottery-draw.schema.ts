import { z } from 'zod';

export const CloseLotteryDrawSchema = z.object({
  drawId: z.string().min(1, 'drawId é obrigatório'),
});

export type CloseLotteryDrawInput = z.infer<typeof CloseLotteryDrawSchema>;

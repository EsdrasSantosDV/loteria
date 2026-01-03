import { z } from 'zod';

export const OpenLotteryDrawSchema = z.object({
  drawId: z.string().min(1, 'drawId é obrigatório'),
});

export type OpenLotteryDrawInput = z.infer<typeof OpenLotteryDrawSchema>;

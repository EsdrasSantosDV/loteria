import { z } from 'zod';

export const ApplyDrawResultSchema = z.object({
  numbers: z
    .array(z.number().int('Números devem ser inteiros'))
    .min(1, 'Números são obrigatórios'),
});

export type ApplyDrawResultInput = z.infer<typeof ApplyDrawResultSchema>;


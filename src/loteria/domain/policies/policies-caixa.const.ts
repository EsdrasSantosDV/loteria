import { PrizePolicyBuilder } from './prize-policy-builder';

export const MegaSenaPolicy = PrizePolicyBuilder.named('Mega-Sena')
  .drawCount(6)
  .include(4, 'Quadra (4 acertos)')
  .include(5, 'Quina (5 acertos)')
  .include(6, 'Sena (6 acertos)')
  .restrictTo([{ min: 4, max: 6 }])
  .requireRange(4, 6)
  .build();

export const QuinaPolicy = PrizePolicyBuilder.named('Quina')
  .drawCount(5)
  .range(2, 4)
  .include(5, 'Quina (5 acertos)')
  .restrictTo([{ min: 2, max: 5 }])
  .requireRange(2, 5)
  .build();

export const LotofacilPolicy = PrizePolicyBuilder.named('Lotofácil')
  .drawCount(15)
  .range(11, 15)
  .restrictTo([{ min: 11, max: 15 }])
  .requireRange(11, 15)
  .build();

export const LotomaniaPolicy = PrizePolicyBuilder.named('Lotomania')
  .drawCount(20)
  .range(15, 20)
  .include(0, '0 acertos')
  .restrictTo([0, { min: 15, max: 20 }])
  .requireInclude(0)
  .requireRange(15, 20)
  .build();

export const PrizePolicyCatalog = {
  MEGA_SENA: MegaSenaPolicy,
  QUINA: QuinaPolicy,
  LOTOFACIL: LotofacilPolicy,
  LOTOMANIA: LotomaniaPolicy,
};

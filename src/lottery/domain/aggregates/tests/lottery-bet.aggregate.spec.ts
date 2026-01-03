/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { LotteryBet } from '../lottery-bet.aggregate';
import { BetNumbers } from '../../vo/bet-numbers.vo';
import { Money } from '../../vo/money.vo';
import { ECurrency } from '../../vo/ecurrency.enum';
import { NumberPool } from '../../vo/number-pool.vo';
import { PickCount } from '../../vo/pick-count.vo';
import { NotificationValidationHandler } from 'src/common/domain/validation/notification-validation-handler';
import { MessagesError } from '../../../../common/domain/error/messages.error.enum';

describe('LotteryBet', () => {
  let pool: NumberPool;
  let pick: PickCount;
  let betNumbers: BetNumbers;
  let price: Money;

  beforeEach(() => {
    pool = NumberPool.create(1, 60);
    pick = PickCount.create(6, 15);
    betNumbers = BetNumbers.create([1, 2, 3, 4, 5, 6], pool, pick);
    price = Money.ofCents(500, ECurrency.BRL);
  });

  describe('create', () => {
    it('deve criar um LotteryBet válido', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet).toBeDefined();
      expect(bet.getDrawId().getValue()).toBe('draw-001');
      expect(bet.getGameId().getValue()).toBe('game-001');
      expect(bet.getNumbers()).toBe(betNumbers);
      expect(bet.getPrice()).toBe(price);
      expect(bet.getPlacedAt()).toBeDefined();
    });

    it('deve definir placedAt automaticamente', () => {
      const bet1 = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const bet2 = LotteryBet.create({
        id: 'bet-002',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet1.getPlacedAt()).toBeDefined();
      expect(bet2.getPlacedAt()).toBeDefined();
      expect(bet1.getPlacedAt()).not.toBe(bet2.getPlacedAt());
    });

    it('deve criar múltiplas apostas com diferentes IDs', () => {
      const bet1 = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const bet2 = LotteryBet.create({
        id: 'bet-002',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet1.getId().getValue()).toBe('bet-001');
      expect(bet2.getId().getValue()).toBe('bet-002');
      expect(bet1.getId().equals(bet2.getId())).toBe(false);
    });
  });

  describe('getters', () => {
    it('deve retornar drawId correto', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet.getDrawId().getValue()).toBe('draw-001');
    });

    it('deve retornar gameId correto', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet.getGameId().getValue()).toBe('game-001');
    });

    it('deve retornar numbers correto', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet.getNumbers()).toBe(betNumbers);
      expect(bet.getNumbers().value).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('deve retornar price correto', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet.getPrice()).toBe(price);
      expect(bet.getPrice().amountCents).toBe(500);
    });

    it('deve retornar placedAt correto', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const placedAt = bet.getPlacedAt();
      expect(placedAt).toBeDefined();
      expect(placedAt.value).toBeDefined();
    });
  });

  describe('validate', () => {
    it('deve validar uma aposta válida sem erros', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(false);
    });

    it('deve detectar erro quando drawId está ausente', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._drawId = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some(
            (e: { message: string }) =>
              e.message === MessagesError.LOTTERY_BET_DRAW_ID_REQUIRED,
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando gameId está ausente', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._gameId = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some(
            (e: { message: string }) =>
              e.message === MessagesError.LOTTERY_BET_GAME_ID_REQUIRED,
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando numbers está ausente', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._numbers = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some(
            (e: { message: string }) =>
              e.message === MessagesError.LOTTERY_BET_NUMBERS_REQUIRED,
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando price está ausente', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._price = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some(
            (e: { message: string }) =>
              e.message === MessagesError.LOTTERY_BET_PRICE_REQUIRED,
          ),
      ).toBe(true);
    });

    it('deve detectar erro quando placedAt está ausente', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._placedAt = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(
        handler
          .getErrors()
          .some(
            (e: { message: string }) =>
              e.message === MessagesError.LOTTERY_BET_PLACED_AT_REQUIRED,
          ),
      ).toBe(true);
    });

    it('deve detectar múltiplos erros quando vários campos estão ausentes', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      (bet as any)._drawId = null;
      (bet as any)._gameId = null;
      (bet as any)._numbers = null;

      const handler = new NotificationValidationHandler();
      bet.validate(handler);

      expect(handler.hasError()).toBe(true);
      expect(handler.getErrors().length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('equals', () => {
    it('deve retornar true para LotteryBets iguais', () => {
      const bet1 = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const bet2 = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet1.equals(bet2)).toBe(true);
    });

    it('deve retornar false para LotteryBets com IDs diferentes', () => {
      const bet1 = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      const bet2 = LotteryBet.create({
        id: 'bet-002',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet1.equals(bet2)).toBe(false);
    });

    it('deve retornar false quando comparado com undefined', () => {
      const bet = LotteryBet.create({
        id: 'bet-001',
        drawId: 'draw-001',
        gameId: 'game-001',
        numbers: betNumbers,
        price,
      });

      expect(bet.equals(undefined)).toBe(false);
    });
  });
});

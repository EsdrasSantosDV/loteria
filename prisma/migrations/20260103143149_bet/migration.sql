-- CreateEnum
CREATE TYPE "currency" AS ENUM ('BRL', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "lottery_bet" (
    "id" TEXT NOT NULL,
    "draw_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "numbers" JSONB NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL,
    "placed_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "settlement" JSONB,

    CONSTRAINT "lottery_bet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lottery_bet" ADD CONSTRAINT "lottery_bet_draw_id_fkey" FOREIGN KEY ("draw_id") REFERENCES "lottery_draw"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lottery_bet" ADD CONSTRAINT "lottery_bet_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "lottery_game_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "lottery_draw" (
    "id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "contest_number" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "draw_numbers" JSONB,
    "is_settled" BOOLEAN NOT NULL,
    "settled_at" TIMESTAMP(3),
    "draw_at" TIMESTAMP(3),

    CONSTRAINT "lottery_draw_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lottery_draw" ADD CONSTRAINT "lottery_draw_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "lottery_game_definition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

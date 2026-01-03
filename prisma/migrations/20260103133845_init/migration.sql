-- CreateTable
CREATE TABLE "lottery_game_definition" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "lottery_game_definition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lottery_game_definition_code_key" ON "lottery_game_definition"("code");

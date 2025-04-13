/*
  Warnings:

  - You are about to drop the column `disponibilidade` on the `encontreiros` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Value_Disponibilidade" AS ENUM ('MUITO_BAIXA', 'BAIXA', 'MEDIA', 'ALTA', 'MUITO_ALTA', 'NAO_PREENCHEU');

-- AlterTable
ALTER TABLE "encontreiros" DROP COLUMN "disponibilidade",
ADD COLUMN     "id_disponibilidade" "Value_Disponibilidade";

-- DropEnum
DROP TYPE "DisponibilidadePre";

-- CreateTable
CREATE TABLE "@disponibilidade" (
    "id" "Value_Disponibilidade" NOT NULL,
    "disponibilidade" TEXT NOT NULL,

    CONSTRAINT "@disponibilidade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "@disponibilidade_id_key" ON "@disponibilidade"("id");

-- CreateIndex
CREATE UNIQUE INDEX "@disponibilidade_disponibilidade_key" ON "@disponibilidade"("disponibilidade");

-- AddForeignKey
ALTER TABLE "encontreiros" ADD CONSTRAINT "encontreiros_id_disponibilidade_fkey" FOREIGN KEY ("id_disponibilidade") REFERENCES "@disponibilidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

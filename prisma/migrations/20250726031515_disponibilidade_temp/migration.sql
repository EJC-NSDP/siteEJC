/*
  Warnings:

  - Made the column `id_disponibilidade` on table `encontreiros` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "encontreiros" DROP CONSTRAINT "encontreiros_id_disponibilidade_fkey";

-- AlterTable
ALTER TABLE "encontreiros" ALTER COLUMN "id_disponibilidade" SET NOT NULL,
ALTER COLUMN "id_disponibilidade" SET DEFAULT 'NAO_PREENCHEU';

-- AddForeignKey
ALTER TABLE "encontreiros" ADD CONSTRAINT "encontreiros_id_disponibilidade_fkey" FOREIGN KEY ("id_disponibilidade") REFERENCES "@disponibilidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

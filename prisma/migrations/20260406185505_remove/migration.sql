/*
  Warnings:

  - You are about to drop the column `role` on the `pessoas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "encontros" ALTER COLUMN "data_inicio" SET DEFAULT '1970-01-01'::timestamp,
ALTER COLUMN "data_tema" SET DEFAULT '1970-01-01'::timestamp;

-- AlterTable
ALTER TABLE "pessoas" DROP COLUMN "role";

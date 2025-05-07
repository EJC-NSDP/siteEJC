/*
  Warnings:

  - The primary key for the `@funcoes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `@funcoes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "lideranca" DROP CONSTRAINT "lideranca_id_funcao_fkey";

-- AlterTable
ALTER TABLE "@funcoes" DROP CONSTRAINT "@funcoes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "@funcoes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "@funcoes_id_seq";

-- AlterTable
ALTER TABLE "lideranca" ALTER COLUMN "id_funcao" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "@funcoes_id_key" ON "@funcoes"("id");

-- AddForeignKey
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_id_funcao_fkey" FOREIGN KEY ("id_funcao") REFERENCES "@funcoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

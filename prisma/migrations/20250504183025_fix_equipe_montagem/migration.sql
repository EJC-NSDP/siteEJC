/*
  Warnings:

  - The primary key for the `equipes_montagem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idEncontreiro` on the `equipes_montagem` table. All the data in the column will be lost.
  - You are about to drop the column `valueEquipe` on the `equipes_montagem` table. All the data in the column will be lost.
  - Added the required column `id_encontreiro` to the `equipes_montagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_equipe` to the `equipes_montagem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "equipes_montagem" DROP CONSTRAINT "equipes_montagem_idEncontreiro_fkey";

-- DropForeignKey
ALTER TABLE "equipes_montagem" DROP CONSTRAINT "equipes_montagem_valueEquipe_fkey";

-- AlterTable
ALTER TABLE "equipes_montagem" DROP CONSTRAINT "equipes_montagem_pkey",
DROP COLUMN "idEncontreiro",
DROP COLUMN "valueEquipe",
ADD COLUMN     "id_encontreiro" TEXT NOT NULL,
ADD COLUMN     "value_equipe" TEXT NOT NULL,
ADD CONSTRAINT "equipes_montagem_pkey" PRIMARY KEY ("id_encontreiro");

-- AddForeignKey
ALTER TABLE "equipes_montagem" ADD CONSTRAINT "equipes_montagem_id_encontreiro_fkey" FOREIGN KEY ("id_encontreiro") REFERENCES "encontreiros"("id_pessoa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipes_montagem" ADD CONSTRAINT "equipes_montagem_value_equipe_fkey" FOREIGN KEY ("value_equipe") REFERENCES "@equipes"("equipe_value") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `id_categoria` to the `cartas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cartas" ADD COLUMN     "id_categoria" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "@categorias_cartas" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "@categorias_cartas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "@categorias_cartas_id_key" ON "@categorias_cartas"("id");

-- AddForeignKey
ALTER TABLE "cartas" ADD CONSTRAINT "cartas_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "@categorias_cartas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

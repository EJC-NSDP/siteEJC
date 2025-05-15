/*
  Warnings:

  - A unique constraint covering the columns `[value]` on the table `quadrante` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "quadrante_value_key" ON "quadrante"("value");

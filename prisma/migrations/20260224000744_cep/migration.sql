/*
  Warnings:

  - A unique constraint covering the columns `[endereco_cep]` on the table `locais` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "locais_endereco_cep_key" ON "locais"("endereco_cep");

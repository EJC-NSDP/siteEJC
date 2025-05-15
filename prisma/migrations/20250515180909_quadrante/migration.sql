-- CreateEnum
CREATE TYPE "Value_Quadrante" AS ENUM ('amarelo', 'azul', 'laranja', 'verde', 'vermelho', 'capa_pb', 'capa_colorida', 'circulos_pb', 'circulos_colorida', 'equipe', 'carta_padre', 'carta_papa', 'carta_diris');

-- CreateTable
CREATE TABLE "quadrante" (
    "value" "Value_Quadrante" NOT NULL,
    "label" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "quadrante_pkey" PRIMARY KEY ("value")
);

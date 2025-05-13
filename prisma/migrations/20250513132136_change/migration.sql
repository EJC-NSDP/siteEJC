/*
  Warnings:

  - The primary key for the `palestrantes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `palestrantes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "palestrantes" DROP CONSTRAINT "palestrantes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "palestrantes_pkey" PRIMARY KEY ("id_encontro", "id_palestra");

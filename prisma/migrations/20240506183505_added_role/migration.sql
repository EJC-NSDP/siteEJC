-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DIRIGENTE', 'ENCONTREIRO', 'COORDENADOR', 'EXTERNA', 'SECRETARIA', 'ENCONTRISTA', 'TIOEXTERNA');

-- AlterTable
ALTER TABLE "pessoas" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'ENCONTRISTA';

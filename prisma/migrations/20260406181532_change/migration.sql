-- AlterTable
ALTER TABLE "encontros" ALTER COLUMN "data_inicio" SET DEFAULT '1970-01-01'::timestamp,
ALTER COLUMN "data_tema" SET DEFAULT '1970-01-01'::timestamp;

-- AlterTable
ALTER TABLE "pessoas" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['ENCONTRISTA']::"Role"[];

-- AlterTable
ALTER TABLE "encontros" ALTER COLUMN "data_inicio" SET DEFAULT '1970-01-01'::timestamp,
ALTER COLUMN "data_tema" SET DEFAULT '1970-01-01'::timestamp;

-- AlterTable
ALTER TABLE "lideranca" ADD COLUMN     "id_dom" TEXT,
ADD COLUMN     "id_pasta" TEXT;

-- CreateTable
CREATE TABLE "@dons" (
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "@dons_pkey" PRIMARY KEY ("value")
);

-- CreateTable
CREATE TABLE "@pastas" (
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "@pastas_pkey" PRIMARY KEY ("value")
);

-- CreateIndex
CREATE UNIQUE INDEX "@dons_label_key" ON "@dons"("label");

-- CreateIndex
CREATE UNIQUE INDEX "@pastas_label_key" ON "@pastas"("label");

-- AddForeignKey
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_id_dom_fkey" FOREIGN KEY ("id_dom") REFERENCES "@dons"("value") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_id_pasta_fkey" FOREIGN KEY ("id_pasta") REFERENCES "@pastas"("value") ON DELETE SET NULL ON UPDATE CASCADE;

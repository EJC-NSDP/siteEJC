-- CreateTable
CREATE TABLE "palestrantes" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 100,
    "id_encontro" TEXT NOT NULL,
    "id_palestra" INTEGER NOT NULL,
    "nome" TEXT,

    CONSTRAINT "palestrantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "@palestras" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "@palestras_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "palestrantes" ADD CONSTRAINT "palestrantes_id_encontro_fkey" FOREIGN KEY ("id_encontro") REFERENCES "encontros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "palestrantes" ADD CONSTRAINT "palestrantes_id_palestra_fkey" FOREIGN KEY ("id_palestra") REFERENCES "@palestras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

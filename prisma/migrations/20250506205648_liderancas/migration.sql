-- CreateTable
CREATE TABLE "lideranca" (
    "id_pessoa" TEXT NOT NULL,
    "id_funcao" INTEGER NOT NULL,
    "ano" INTEGER NOT NULL,

    CONSTRAINT "lideranca_pkey" PRIMARY KEY ("id_pessoa","ano")
);

-- CreateTable
CREATE TABLE "@funcoes" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "logo" TEXT,

    CONSTRAINT "@funcoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_id_funcao_fkey" FOREIGN KEY ("id_funcao") REFERENCES "@funcoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

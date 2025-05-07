-- AddForeignKey
ALTER TABLE "lideranca" ADD CONSTRAINT "lideranca_id_pessoa_fkey" FOREIGN KEY ("id_pessoa") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

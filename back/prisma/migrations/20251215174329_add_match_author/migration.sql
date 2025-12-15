-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "updated_by_id" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

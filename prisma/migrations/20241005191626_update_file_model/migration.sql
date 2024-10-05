/*
  Warnings:

  - You are about to drop the column `filename` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `File` table. All the data in the column will be lost.
  - Changed the type of `size` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "filename",
DROP COLUMN "path",
DROP COLUMN "size",
ADD COLUMN     "size" BIGINT NOT NULL;

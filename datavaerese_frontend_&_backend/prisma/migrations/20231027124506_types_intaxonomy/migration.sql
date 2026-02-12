/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TypesInTaxonomy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `TypesInTaxonomy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TypesInTaxonomy" ADD COLUMN     "name" VARCHAR(300) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TypesInTaxonomy_name_key" ON "TypesInTaxonomy"("name" ASC);

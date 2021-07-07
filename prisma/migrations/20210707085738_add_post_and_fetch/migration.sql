/*
  Warnings:

  - The primary key for the `testimonials` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "testimonials" DROP CONSTRAINT "testimonials_pkey",
ADD COLUMN     "author_name" VARCHAR,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD PRIMARY KEY ("id");
DROP SEQUENCE "testimonials_id_seq";

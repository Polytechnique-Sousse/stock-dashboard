/*
  Warnings:

  - You are about to drop the column `leadTime` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `products` on the `Supplier` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Supplier` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Supplier_email_key";

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "leadTime",
DROP COLUMN "products",
DROP COLUMN "updatedAt",
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

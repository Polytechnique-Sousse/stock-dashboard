-- DropForeignKey
ALTER TABLE "Inbound" DROP CONSTRAINT "Inbound_productId_fkey";

-- DropForeignKey
ALTER TABLE "Outbound" DROP CONSTRAINT "Outbound_productId_fkey";

-- AddForeignKey
ALTER TABLE "Inbound" ADD CONSTRAINT "Inbound_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outbound" ADD CONSTRAINT "Outbound_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

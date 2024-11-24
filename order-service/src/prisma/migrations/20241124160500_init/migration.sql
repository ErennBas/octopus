/*
  Warnings:

  - You are about to alter the column `status` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `productId` VARCHAR(191) NOT NULL;

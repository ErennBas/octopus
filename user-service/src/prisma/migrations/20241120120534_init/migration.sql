/*
  Warnings:

  - Added the required column `country` to the `Addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Addresses" ADD COLUMN     "country" TEXT NOT NULL;

/*
  Warnings:

  - The primary key for the `tenant` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "TenantUserRole" AS ENUM ('OWNER', 'ADMIN', 'TECHNICIAN', 'STAFF');

-- AlterTable
ALTER TABLE "tenant" DROP CONSTRAINT "tenant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "onboarded_at" DROP NOT NULL,
ALTER COLUMN "onboarded_at" DROP DEFAULT,
ADD CONSTRAINT "tenant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "tenant_id_seq";

-- CreateTable
CREATE TABLE "platform_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_user" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TenantUserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_user_userId_key" ON "platform_user"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_user_tenantId_userId_key" ON "tenant_user"("tenantId", "userId");

-- AddForeignKey
ALTER TABLE "platform_user" ADD CONSTRAINT "platform_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_user" ADD CONSTRAINT "tenant_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('system', 'tenant');

-- CreateEnum
CREATE TYPE "public"."TenantRole" AS ENUM ('admin', 'outlet', 'frontdesk', 'technician');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "email" TEXT,
    "phoneNumber" TEXT,
    "hashedPassword" TEXT,
    "type" "public"."UserType" NOT NULL DEFAULT 'tenant',
    "name" TEXT,
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TenantStaff" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "public"."TenantRole" NOT NULL DEFAULT 'frontdesk',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantStaff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_domain_key" ON "public"."Tenant"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "TenantStaff_userId_key" ON "public"."TenantStaff"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantStaff_tenantId_key" ON "public"."TenantStaff"("tenantId");

-- AddForeignKey
ALTER TABLE "public"."TenantStaff" ADD CONSTRAINT "TenantStaff_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TenantStaff" ADD CONSTRAINT "TenantStaff_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

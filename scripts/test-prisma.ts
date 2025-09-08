import "dotenv/config";
import prisma from "@/lib/prisma";
import { UserType, TenantRole } from "@prisma/client";

async function createTenant() {
  const tenant = await prisma.tenant.create({
    data: { domain: "abc.tenant.com", name: "ABC Tenant" },
  });

  const user = await prisma.user.create({
    data: {
      email: "abc@email.com",
      name: "ABC Admin",
    },
  });

  const tenantStaff = await prisma.tenantStaff.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: TenantRole.ADMIN,
    },
  });

  console.log("Tenant Created: ", tenant);
  console.log("User Created: ", user);
  console.log("Tenant Staff Created: ", tenantStaff);
}

async function createSystemAdmin() {
  const email = "m.amirazmi@hotmail.com";
  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: email } },
  });

  if (existingUser) {
    console.log("User exists with the email: ", email);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: "Muhamad Amir",
      type: UserType.SYSTEM,
    },
  });

  console.log("System User Created: ", user);
}

async function getUser() {
  const users = await prisma.user.findMany();
  console.log("Users: ", users);
}

async function getTenantStaff() {
  const tenantStaffs = await prisma.tenantStaff.findMany({
    include: {
      tenant: true,
      user: true,
    },
  });
  console.log("Users: ", tenantStaffs);
}

async function main() {
  // return await createTenant();
  // return await createSystemAdmin();
  // return await getUser();
  return await getTenantStaff();
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

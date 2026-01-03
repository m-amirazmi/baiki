"server-only";

import slugify from "slugify";
import { prisma } from "./prisma";

export async function generateUniqueSlug(name: string): Promise<string> {
  // Step 1: create a base slug
  const baseSlug = slugify(name, { lower: true, strict: true });

  let slug = baseSlug;
  let counter = 1;

  // Step 2: loop until unique slug found
  while (true) {
    const existing = await prisma.tenant.findUnique({
      where: { slug },
      select: { id: true }, // just need to know if it exists
    });

    if (!existing) {
      // slug is unique
      return slug;
    }

    // slug exists → append counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

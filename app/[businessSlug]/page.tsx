import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug: businessSlug },
  });

  return (
    <div>
      <h1>Business Page</h1>
      <p>Business Slug: {businessSlug}</p>
      <p>Business Name: {business?.name}</p>
      <Link href={`/admin`}>Go to admin</Link>
    </div>
  );
}

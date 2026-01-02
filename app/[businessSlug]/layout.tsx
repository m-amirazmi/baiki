import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  const isExists = await prisma.business.findUnique({
    where: { slug: businessSlug },
  });

  if (!isExists) {
    notFound();
  }

  return <>{children}</>;
}

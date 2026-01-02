import { api } from "@/lib/eden";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Baiki Business | Repair Management Platform",
  description: "Manage repair businesses efficiently with Baiki.",
};

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  const { data } = await api.tenants({ slug: businessSlug }).get();

  if (!data) {
    notFound();
  }

  return <>{children}</>;
}

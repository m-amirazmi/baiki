import { api } from "@/lib/eden";
import { getHeadersAsObject } from "@/lib/server-utils";
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
  const headers = await getHeadersAsObject();
  const { data } = await api.tenants({ slug: businessSlug }).get({ headers });

  if (!data) {
    notFound();
  }

  return <>{children}</>;
}

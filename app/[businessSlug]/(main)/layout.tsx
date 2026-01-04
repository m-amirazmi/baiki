import { TenantLayout } from "@/components/tenant/layout";
import { getTenantUserContext } from "@/modules/tenant/tenant.actions";
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
  const { data: profile } = await getTenantUserContext(businessSlug);

  if (!profile) {
    notFound();
  }

  return <TenantLayout profile={profile}>{children}</TenantLayout>;
}

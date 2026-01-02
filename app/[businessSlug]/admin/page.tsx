import { api } from "@/lib/eden";

export default async function BusinessAdminPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  const { data } = await api.tenants({ slug: businessSlug }).get();

  return (
    <div>
      <h1>Business Admin Page</h1>
      <p>Business Slug: {businessSlug}</p>
      <p>
        Business Name: {data?.name} {data?.id}
      </p>
    </div>
  );
}

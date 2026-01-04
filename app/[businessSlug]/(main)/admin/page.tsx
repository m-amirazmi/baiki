import { getTenantUserContext } from "@/modules/tenant/tenant.actions";

export default async function BusinessAdminPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  const { data } = await getTenantUserContext(businessSlug);

  return (
    <div>
      <h1>Business Admin Page</h1>
      <p>Business Slug: {businessSlug}</p>
      <p>
        Business Name: {data?.tenant.name} {data?.tenant.id}
      </p>
      <p>
        User Role: {data?.user.role} (User ID: {data?.user.id})
      </p>
    </div>
  );
}

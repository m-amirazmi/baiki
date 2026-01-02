export default async function BusinessAdminPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  return (
    <div>
      <h1>Business Admin Page</h1>
      <p>Business Slug: {businessSlug}</p>
    </div>
  );
}

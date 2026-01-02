import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BusinessPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;

  return (
    <div>
      <h1>Business Page</h1>
      <p>Business Slug: {businessSlug}</p>
      <Button asChild>
        <Link href={`/admin`}>Go to admin</Link>
      </Button>
    </div>
  );
}

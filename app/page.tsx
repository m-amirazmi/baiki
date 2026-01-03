import { AllTenants } from "@/components/platform/all-tenants";
import { api } from "@/lib/eden";
import Link from "next/link";

export default async function Page() {
  const { data } = await api.tenants.get();

  return (
    <div>
      <Link href="/signup">Go to Sign Up</Link>
      {data && <AllTenants tenants={data} />}
    </div>
  );
}

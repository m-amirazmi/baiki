import { CreateBusinessForm } from "@/components/forms/create-business-form";
import { SignInForm } from "@/components/forms/signin-form";
import { AllTenants } from "@/components/platform/all-tenants";
import { api } from "@/lib/eden";

export default async function Page() {
  const { data } = await api.tenants.get();

  return (
    <div>
      <SignInForm />
      <CreateBusinessForm />
      {data && <AllTenants tenants={data} />}
    </div>
  );
}

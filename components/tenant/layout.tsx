import { TenantHeader } from "@/components/tenant/header";
import { TenantSidebar } from "@/components/tenant/sidebar";
import { cn } from "@/lib/utils";
import { TenantUserContext } from "@/modules/tenant/tenant-user.model";

interface TenantLayoutProps {
  children: React.ReactNode;
  profile: TenantUserContext;
}

export const TenantLayout = ({ children, profile }: TenantLayoutProps) => {
  return (
    <div className={cn("grid grid-cols-[250px_1fr] min-h-screen")}>
      <TenantSidebar />
      <div>
        <TenantHeader profile={profile} />
        {children}
      </div>
    </div>
  );
};

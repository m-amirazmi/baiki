import UsersTable from "@/components/platform/users-table";
import { Button } from "@/components/ui/button";
import { RiAddLine } from "@remixicon/react";

export default function PlatformUsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Button className="px-3 cursor-pointer">
          <RiAddLine size={22} /> Add User
        </Button>
      </div>
      <UsersTable />
    </div>
  );
}

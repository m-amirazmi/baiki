"use client";

import { api } from "@/convex/_generated/api";
import { Role } from "@/lib/enum";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type RoleGuardType = {
  children: React.ReactNode;
  allowedRoles: Role[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardType) {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user === undefined) return; // query still loading
    if (!user.success) {
      // not logged in
      router.replace("/login");
      return;
    }

    const hasAccess = user.data?.roles?.some((role: Role) =>
      allowedRoles.includes(role)
    );

    if (!hasAccess) router.replace("/unauthorized");
  }, [user, router, allowedRoles]);

  if (user === undefined) return <p>Loading...</p>;

  return <>{children}</>;
}

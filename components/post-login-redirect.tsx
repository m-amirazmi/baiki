"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "@/lib/enum";

const roleRedirectMap = {
  [Role.PLATFORM]: "/platform/dashboard",
  [Role.CUSTOMER]: "/customer/home",
  [Role.TENANT]: "/tenant/dashboard",
  [Role.OUTLET]: "/outlet/dashboard",
  [Role.TECHNICIAN]: "/technician/jobs",
  [Role.POS]: "/pos/sales",
};

export default function PostLoginRedirect() {
  const user = useQuery(api.users.getCurrentUser);
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) return; // still loading
    if (!user.success) {
      router.replace("/signin");
      return;
    }

    let roleToUse: Role | "" | undefined = user.data?.preferredRole;

    if (!roleToUse && user.data?.roles?.length) {
      roleToUse = user.data.roles[0];
    }

    // ✅ Step 3: fallback to a system default (e.g. CUSTOMER)
    if (!roleToUse) {
      roleToUse = Role.CUSTOMER;
    }

    router.replace(roleRedirectMap[roleToUse]);
  }, [user, router]);

  return <p>Redirecting...</p>;
}

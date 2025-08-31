"use client";

import { useEffect } from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function AuthWatcher() {
  const { isAuthenticated } = useConvexAuth();
  const ensureCustomerRole = useMutation(api.mutations.auth.ensureCustomerRole);

  useEffect(() => {
    if (isAuthenticated) {
      ensureCustomerRole();
    }
  }, [isAuthenticated, ensureCustomerRole]);

  return null;
}

"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useEffect } from "react";

export default function UsersTable() {
  const users = useQuery(api.users.getAllUsers);

  if (users === undefined) {
    return <div>Loading...</div>;
  }

  return <div>Users Table</div>;
}

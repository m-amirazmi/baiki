"use client";

import { Tenant } from "@/modules/tenant/tenant.model";
import Link from "next/link";
import { useState } from "react";

interface AllTenantsProps {
  tenants: Array<Tenant>;
}

export const AllTenants = ({ tenants }: AllTenantsProps) => {
  const [hostname] = useState(() =>
    typeof window !== "undefined" ? window.location.hostname : ""
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Tenants</h2>
      <ul className="space-y-2">
        {tenants.map((tenant) => (
          <Link
            key={tenant.id}
            href={hostname ? `//${tenant.slug}.${hostname}` : "#"}
            target="_blank"
          >
            <li className="border p-4 rounded">
              <h3 className="text-lg font-medium">{tenant.name}</h3>
              <p>Slug: {tenant.slug}</p>
              <p>Status: {tenant.status}</p>
              <p>Type: {tenant.type}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

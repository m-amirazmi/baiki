"use client";

import { Tenant } from "@/modules/tenant/tenant.model";

interface AllTenantsProps {
  tenants: Array<Tenant>;
}

export const AllTenants = ({ tenants }: AllTenantsProps) => {
  const handleTenantClick = (slug: string) => {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    window.open(`${protocol}//${slug}.${hostname}`, "_blank");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Tenants</h2>
      <ul className="space-y-2">
        {tenants.map((tenant) => (
          <li
            key={tenant.id}
            className="border p-4 rounded cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleTenantClick(tenant.slug)}
          >
            <h3 className="text-lg font-medium">{tenant.name}</h3>
            <p>Slug: {tenant.slug}</p>
            <p>Status: {tenant.status}</p>
            <p>Type: {tenant.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

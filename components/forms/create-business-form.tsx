"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TenantStatus, TenantType } from "@/app/generated/prisma/enums";
import { createTenant } from "@/modules/tenant/tenant.actions";
import { useState } from "react";
import { generateSlug } from "@/lib/utils";

export const CreateBusinessForm = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<TenantStatus>(TenantStatus.ACTIVE);
  const [type, setType] = useState<TenantType>(TenantType.CUSTOMER);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await createTenant({
        name,
        slug,
        createdBy: "user-123",
        status,
        type,
        token: localStorage.getItem("token") || "",
      });

      if (!result.success) {
        setError(result.error || "Failed to create tenant");
        return;
      }

      // Redirect to the business subdomain
      window.location.href = `//${slug}.${window.location.hostname}/`;
    } catch (err) {
      console.error(err);
      setError("Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create Business Form</h2>

      {/* Example fields – replace with your UI kit if you have one */}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={handleNameChange}
        className="border rounded p-2 w-full"
        required
      />
      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="border rounded p-2 w-full"
        required
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as TenantStatus)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TenantStatus).map((statusValue) => (
              <SelectItem key={statusValue} value={statusValue}>
                {statusValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as TenantType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TenantType).map((typeValue) => (
              <SelectItem key={typeValue} value={typeValue}>
                {typeValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create Tenant"}
      </Button>
    </form>
  );
};

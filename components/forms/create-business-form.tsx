"use client";

import { Button } from "@/components/ui/button";
import { createTenant } from "@/modules/tenant/tenant.actions";
import { useState } from "react";

export const CreateBusinessForm = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop native form refresh
    setLoading(true);
    setError(null);
    try {
      await createTenant({
        name,
        slug,
        createdBy: "user-123", // you could make this dynamic too
      });
      // optional: clear fields or show success toast
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
        onChange={(e) => setName(e.target.value)}
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

      {error && <p className="text-red-500">{error}</p>}

      <Button type="submit" disabled={loading}>
        {loading ? "Creating…" : "Create Tenant"}
      </Button>
    </form>
  );
};

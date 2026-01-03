import { treaty } from "@elysiajs/eden";
import { app } from "../app/api/[[...slugs]]/route";

// .api to enter /api prefix
export const api =
  typeof process !== "undefined" && typeof window === "undefined"
    ? treaty(app).api
    : treaty<typeof app>(process.env.NEXT_PUBLIC_ROOT_DOMAIN || "", {
        fetch: { credentials: "include" },
      }).api;

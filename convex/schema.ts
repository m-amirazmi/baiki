import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { roleTables } from "./schema/roles";

const schema = defineSchema({
  ...authTables,
  ...roleTables,
});

export default schema;

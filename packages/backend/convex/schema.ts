import { defineSchema } from "convex/server";
import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const Users = Table("users", {
  name: v.string(),
  email: v.string(),
});

export default defineSchema({
  users: Users.table.index("by_email", ["email"]),
});

import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const addUser = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError("Unauthorized");
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError("Missing Organization");
    }

    throw new ConvexError("Tracking not implemented");

    return await ctx.db.insert("users", {
      name: "John Doe",
      email: "john.doe@example.com",
    });
  },
});

import { v } from "convex/values";
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
    return await ctx.db.insert("users", {
      name: "John",
      email: "john@demo.com",
    });
  },
});

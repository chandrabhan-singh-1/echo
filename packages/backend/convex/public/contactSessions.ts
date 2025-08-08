import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import { ContactSessions } from "../schema";

// 24 hours in milliseconds
const SESSION_DURATION = 1000 * 60 * 60 * 24;

export const create = mutation({
  args: {
    ...ContactSessions.withoutSystemFields,
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION;
    const contactSessionId = await ctx.db.insert("contactSessions", {
      ...args,
      expiresAt,
    });
    return contactSessionId;
  },
});

export const validate = mutation({
  args: { contactSessionId: v.id("contactSessions") },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      return { valid: false, reason: "Contact session not found" };
    }
    if (contactSession.expiresAt < Date.now()) {
      return { valid: false, reason: "Contact session expired" };
    }
    return { valid: true, contactSession };
  },
});

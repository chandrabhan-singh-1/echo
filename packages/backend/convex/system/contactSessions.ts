import { ConvexError, v } from "convex/values";
import { internalQuery } from "../_generated/server";

export const getOne = internalQuery({
  args: { contactSessionId: v.id("contactSessions") },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact session not found",
      });
    }
    return contactSession;
  },
});

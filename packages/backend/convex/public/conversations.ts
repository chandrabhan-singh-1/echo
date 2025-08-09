import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session not found or expired",
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation || conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Conversation not found or does not belong to contact session",
      });
    }

    return {
      _id: conversation._id,
      threadId: conversation.threadId,
      organizationId: conversation.organizationId,
      status: conversation.status,
    };
  },
});

export const create = mutation({
  args: {
    organizationId: v.string(),
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Contact session not found or expired",
      });
    }

    // TODO: Generate threadId
    const threadId = "12345";

    const conversationId = await ctx.db.insert("conversations", {
      threadId,
      organizationId: args.organizationId,
      contactSessionId: session._id,
      status: "unresolved",
    });

    return conversationId;
  },
});

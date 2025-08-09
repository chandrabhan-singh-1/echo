import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api";

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
        code: "NOT_FOUND",
        message: "Conversation not found",
      });
    }

    if (conversation.contactSessionId !== session._id) {
      throw new ConvexError({
        code: "UNAUTHORIZED",
        message: "Incorrect contact session",
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

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.organizationId,
    });

    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: "assistant",
        // TODO: Later modify to widget settings' intial message
        content: "Hello! How can I help you today?",
      },
    });

    const conversationId = await ctx.db.insert("conversations", {
      threadId,
      organizationId: args.organizationId,
      contactSessionId: session._id,
      status: "unresolved",
    });

    return conversationId;
  },
});

import { defineSchema } from "convex/server";
import { Table } from "convex-helpers/server";
import { v } from "convex/values";

export const Users = Table("users", {
  name: v.string(),
  email: v.string(),
});

export const ContactSessions = Table("contact_sessions", {
  name: v.string(),
  email: v.string(),
  organizationId: v.string(),
  expiresAt: v.number(),
  metadata: v.optional(
    v.object({
      userAgent: v.optional(v.string()),
      language: v.optional(v.string()),
      languages: v.optional(v.string()),
      screenResolution: v.optional(v.string()),
      viewportSize: v.optional(v.string()),
      timezone: v.optional(v.string()),
      timezoneOffset: v.optional(v.number()),
      cookieEnabled: v.optional(v.boolean()),
      referrer: v.optional(v.string()),
      currentUrl: v.optional(v.string()),
    })
  ),
});

export const Conversations = Table("conversations", {
  threadId: v.string(),
  organizationId: v.string(),
  contactSessionId: v.id("contactSessions"),
  status: v.union(
    v.literal("resolved"),
    v.literal("unresolved"),
    v.literal("escalated")
  ),
});

export default defineSchema({
  users: Users.table.index("by_email", ["email"]),

  contactSessions: ContactSessions.table
    .index("by_organization_id", ["organizationId"])
    .index("by_expires_at", ["expiresAt"]),

  conversations: Conversations.table
    .index("by_organization_id", ["organizationId"])
    .index("by_contact_session_id", ["contactSessionId"])
    .index("by_thread_id", ["threadId"])
    .index("by_status_and_organization_id", ["status", "organizationId"]),
});

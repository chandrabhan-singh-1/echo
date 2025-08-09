import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});

export const supportAgent = new Agent(components.agent, {
  chat: openrouter.chat("moonshotai/kimi-k2:free"),
  instructions:
    "You are a supoprt agent, You will be given a conversation and you need to respond to the user's message.",
});

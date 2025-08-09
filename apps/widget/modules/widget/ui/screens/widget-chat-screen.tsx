"use client";

import { useAtom, useAtomValue } from "jotai";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { AlertTriangleIcon, ArrowLeftIcon, MenuIcon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useSetAtom } from "jotai";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { AIResponse } from "@workspace/ui/components/ai/response";
import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@workspace/ui/components/form";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);

  const [conversationId, setConversationId] = useAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId ?? "")
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? { conversationId, contactSessionId }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
      ? {
          threadId: conversation?.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) return;

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <Button size="icon" onClick={onBack}>
            <ArrowLeftIcon className="size-4" />
          </Button>
          <p>Chat</p>
        </div>
        <Button size="icon" variant="transparent">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          {toUIMessages(messages.results ?? []).map((message) => {
            console.log("from: ", message.role);
            return (
              <AIMessage
                key={message.id}
                from={message.role === "user" ? "user" : "assistant"}
              >
                <AIMessageContent
                  className={
                    message.role === "user"
                      ? "ml-auto bg-blue-700 text-white"
                      : "mr-auto"
                  }
                >
                  <AIResponse>{message.content}</AIResponse>
                </AIMessageContent>
                {/* TODO: Add avatar component */}
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      {/* TODO: Add suggestions */}
      <Form {...form}>
        <AIInput
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-none border-x-0 border-b-0"
        >
          <FormField
            control={form.control}
            name="message"
            disabled={conversation?.status === "resolved"}
            render={({ field }) => (
              <AIInputTextarea
                disabled={conversation?.status === "resolved"}
                onChange={field.onChange}
                placeholder={
                  conversation?.status === "resolved"
                    ? "This conversation has been resolved"
                    : "Type your message..."
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }
                }}
                value={field.value}
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit
              status="ready"
              type="submit"
              disabled={
                conversation?.status === "resolved" || !form.formState.isValid
              }
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};

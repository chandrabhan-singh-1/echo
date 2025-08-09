import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { WidgetHeader } from "../components/widget-header";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Doc } from "@workspace/backend/_generated/dataModel";
import {
  contactSessionIdAtomFamily,
  organizationIdAtom,
} from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId ?? "")
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      return;
    }

    const metadata: Doc<"contactSessions">["metadata"] = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages.join(","),
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer ?? "direct",
      currentUrl: window.location.href,
    };

    const contactSessionId = await createContactSession({
      name: data.name,
      email: data.email,
      organizationId,
      metadata,
    });
    console.log("contactSessionId: ", contactSessionId);
    setContactSessionId(contactSessionId);
  };

  return (
    <>
      <WidgetHeader className="">
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hi There!</p>
          <p className="text-lg">Let&apos;s get you started!</p>
        </div>
      </WidgetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. John Doe"
                    className="h-10 bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g. john.doe@example.com"
                    className="h-10 bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </form>
      </Form>
    </>
  );
};

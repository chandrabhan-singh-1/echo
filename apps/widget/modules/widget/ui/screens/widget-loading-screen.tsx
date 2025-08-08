"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Loader2Icon } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId ?? "")
  );

  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const validateOrganization = useAction(api.public.organizations.validate);

  // step 1: validate organization
  useEffect(() => {
    if (step !== "org") {
      return;
    }

    setLoadingMessage("Checking organization ID");

    if (!organizationId) {
      setErrorMessage("Organization ID is required!");
      setScreen("error");
      return;
    }

    setLoadingMessage("Validating organization...");

    validateOrganization({ organizationId })
      .then((res) => {
        if (res.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage("Organization not found!");
          setScreen("error");
        }
      })
      .catch((error) => {
        setErrorMessage("Failed to validate organization!");
        setScreen("error");
      })
      .finally(() => {
        setLoadingMessage(null);
      });
  }, [
    step,
    setStep,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    validateOrganization,
    setLoadingMessage,
  ]);

  // step 2: validate session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );

  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setSessionValid(false);
      setStep("done");
      return;
    }

    setLoadingMessage("Validating contact session...");

    validateContactSession({ contactSessionId })
      .then((res) => {
        setSessionValid(res.valid);
        setStep("done");
      })
      .catch((error) => {
        setSessionValid(false);
        setStep("done");
      })
      .finally(() => {
        setLoadingMessage(null);
      });
  }, [
    step,
    setStep,
    setLoadingMessage,
    contactSessionId,
    validateContactSession,
  ]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = sessionValid && contactSessionId;

    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, setScreen, sessionValid, contactSessionId]);

  return (
    <div>
      <WidgetHeader className="">
        <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
          <p className="text-3xl">Hey There!</p>
          <p className="text-lg">Let&apos;s get you started!</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm">{loadingMessage ?? "Loading..."}</p>
      </div>
    </div>
  );
};

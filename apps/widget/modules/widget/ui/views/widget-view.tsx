"use client";

import { useAtomValue } from "jotai";
import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";
import { screenAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetScreen } from "@/modules/widget/types";
import { WidgetErrorScreen } from "@/modules/widget/ui/screens/widget-error-screen";
import { WidgetLoadingScreen } from "../screens/widget-loading-screen";

interface Props {
  organizationId: string;
}

export const WidgetView = ({ organizationId }: Props) => {
  const screen = useAtomValue(screenAtom);

  const screenComponents: Record<WidgetScreen, React.ReactNode> = {
    error: <WidgetErrorScreen />,
    auth: <WidgetAuthScreen />,
    chat: <p>TODO: Chat Screen</p>,
    voice: <p>TODO: Voice Screen</p>,
    inbox: <p>TODO: Inbox Screen</p>,
    contact: <p>TODO: Contact Screen</p>,
    loading: <WidgetLoadingScreen organizationId={organizationId} />,
    selection: <p>TODO: Selection Screen</p>,
  };

  return (
    <main className="min-h-screen min-w-screen flex h-full w-full flex-col overflow-hidden rounded-xl border bg-muted">
      {screenComponents[screen]}
    </main>
  );
};

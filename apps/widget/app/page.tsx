"use client";

import { useVapi } from "@/modules/widget/hooks/use-vapi";
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  const {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  } = useVapi();

  return (
    <div className="flex items-center justify-center min-h-svh max-w-md mx-auto w-full gap-2">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Widget</h1>

        <Button size="sm" onClick={() => startCall()}>
          Start Call
        </Button>
        <Button variant={"destructive"} size="sm" onClick={() => endCall()}>
          End Call
        </Button>

        <p>isConnected: {`${isConnected}`}</p>
        <p>isConnecting: {`${isConnecting}`}</p>
        <p>isSpeaking: {`${isSpeaking}`}</p>
        <p>{JSON.stringify(transcript, null, 2)}</p>
      </div>
    </div>
  );
}

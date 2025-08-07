import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { HomeIcon, InboxIcon } from "lucide-react";

export const WidgetFooter = () => {
  return (
    <footer className="flex items-center justify-center border-t bg-background">
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => {}}
        className="h-14 flex-1 rounded-none"
      >
        <HomeIcon className={cn("size-5", "text-primary")} />
      </Button>
      <Button
        size={"icon"}
        variant={"ghost"}
        onClick={() => {}}
        className="h-14 flex-1 rounded-none"
      >
        <InboxIcon className={cn("size-5", "text-primary")} />
      </Button>
    </footer>
  );
};

"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileTriggerProps {
  isMobile: boolean;
  onTrigger: () => void;
}

export function MobileTrigger({ isMobile, onTrigger }: MobileTriggerProps) {
  if (!isMobile) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-8 left-4 z-50 md:hidden rounded-2xl"
      onClick={onTrigger}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Open Menu</span>
    </Button>
  );
}

"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function MobileSidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>

      {/* Drawer */}
      <SheetContent
        side="left"
        className="
          p-0 
          w-[min(320px,100vw)] 
          bg-slate-50 dark:bg-[#1a2235] 
          border-none
          duration-300 ease-in-out
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:slide-in-from-left
          data-[state=closed]:slide-out-to-left
        "
      >
        {/* Accessibility */}
        <VisuallyHidden>
          <SheetTitle>Sidebar Navigation</SheetTitle>
          <SheetDescription>
            Main navigation menu including tasks and settings
          </SheetDescription>
        </VisuallyHidden>

        <AppSidebar isMobile />
      </SheetContent>
    </Sheet>
  );
}
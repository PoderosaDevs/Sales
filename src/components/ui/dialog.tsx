import * as RadixDialog from "@radix-ui/react-dialog";
import { IoClose } from "react-icons/io5";
import { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Dialog({ open, onOpenChange, title, children, maxWidth = "max-w-lg" }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
        <RadixDialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0d0d10] border border-white/10 rounded-[28px] p-6 md:p-8 w-[95vw] shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] outline-none max-h-[90vh] overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-300",
            maxWidth
          )}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" />
              <RadixDialog.Title className="text-lg font-bold text-white uppercase tracking-wider">
                {title}
              </RadixDialog.Title>
            </div>
            <RadixDialog.Close className="text-gray-500 hover:text-white transition-colors">
              <IoClose size={22} />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

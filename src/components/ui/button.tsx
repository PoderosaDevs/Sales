import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20",
        secondary: "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20",
      },
      size: {
        sm: "px-4 py-2 text-[10px]",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-sm",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-accent",
        ghost: "bg-transparent text-fg hover:bg-elevated",
        outline:
          "bg-transparent text-fg shadow-border hover:bg-elevated hover:shadow-border-hover",
      },
      size: {
        md: "h-11 px-5 text-sm rounded-full",
        lg: "h-12 px-6 text-sm rounded-full",
        icon: "size-11 rounded-full",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

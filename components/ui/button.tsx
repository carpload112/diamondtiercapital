import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-slate-50 shadow-md hover:bg-primary/90 hover:shadow-lg active:bg-primary/95",
        destructive:
          "bg-destructive text-slate-50 shadow-md hover:bg-destructive/90 hover:shadow-lg active:bg-destructive/95",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary active:bg-primary/20",
        secondary: "bg-secondary text-primary shadow-md hover:bg-secondary/80 hover:shadow-lg active:bg-secondary/90",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary active:bg-primary/20",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        accent: "bg-accent text-slate-50 shadow-md hover:bg-accent/90 hover:shadow-lg active:bg-accent/95",
        success: "bg-success text-slate-50 shadow-md hover:bg-success/90 hover:shadow-lg active:bg-success/95",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 py-1 text-xs",
        lg: "h-10 rounded-md px-6 py-2.5",
        xl: "h-12 rounded-md px-8 py-3 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ boxShadow: variant === "ghost" || variant === "link" ? "none" : "0 4px 6px rgba(0, 0, 0, 0.1)" }}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

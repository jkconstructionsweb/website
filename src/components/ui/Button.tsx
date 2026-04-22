"use client";
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "filled" | "outlined" | "text" | "elevated" | "tonal"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "filled", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // MD3 styling based on variants
    const variantClasses = {
      filled: "bg-primary text-white hover:bg-primary/90 shadow-sm",
      elevated: "bg-white text-primary shadow-md hover:shadow-lg",
      tonal: "bg-secondary/10 text-secondary hover:bg-secondary/20",
      outlined: "border border-neutral text-primary hover:bg-primary/10",
      text: "text-primary hover:bg-primary/10",
    }

    return (
      <motion.div whileTap={{ scale: 0.98 }} className="inline-block">
        <Comp
          className={cn(
            "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
            variantClasses[variant],
            className
          )}
          ref={ref}
          {...props}
        />
      </motion.div>
    )
  }
)
Button.displayName = "Button"

export { Button }

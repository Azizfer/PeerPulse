import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-line-strong bg-surface px-4 py-3 text-[15px] text-ink shadow-[0_1px_2px_rgba(20,22,27,0.03)] transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-faint hover:border-ink-faint focus:border-pulse focus:outline-none focus:ring-4 focus:ring-pulse/10 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

export { Input }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-display font-semibold tracking-[-0.01em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-ink text-white shadow-soft hover:bg-ink/90 hover:shadow-card hover:-translate-y-0.5 active:translate-y-0",
        accent:
          "bg-pulse text-white shadow-soft hover:bg-pulse-dark hover:shadow-card hover:-translate-y-0.5 active:translate-y-0",
        subtle:
          "bg-pulse-soft text-pulse-dark hover:bg-pulse-soft/70 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "border border-line bg-surface text-ink shadow-soft hover:bg-surface-sunken hover:border-line-strong hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-line-strong bg-transparent text-ink hover:bg-surface hover:border-line-strong/80 hover:-translate-y-0.5 active:translate-y-0",
        ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
        destructive: "bg-rose-deep text-white hover:bg-rose-deep/90 shadow-soft",
        link: "text-ink underline-offset-4 hover:underline hover:text-ink-soft",
      },
      size: {
        default: "h-11 px-5 text-sm",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-[52px] px-7 text-[15px]",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
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
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, loading = false, children, disabled, ...props },
    ref,
  ) => {
    if (asChild) {
      const validChildren = React.Children.toArray(children).filter(
        (child) => !(typeof child === "string" && child.trim() === ""),
      )
      if (validChildren.length !== 1) {
        if (process.env.NODE_ENV !== "production") {
          console.error("<Button asChild> expects a single non-empty React element child.")
        }
        return null
      }
      const childEl = validChildren[0] as React.ReactElement<any, any>
      return React.cloneElement(childEl, {
        className: cn(buttonVariants({ variant, size }), childEl.props.className, className),
        disabled: disabled || loading || childEl.props.disabled,
        ref,
        ...props,
        children: (
          <>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {childEl.props.children}
          </>
        ),
      })
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-display font-semibold tracking-[-0.01em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Solid fill that inverts to a same-color outline on hover — background disappears,
        // border + text pick up the brand color. Border is present in both states at the
        // same width so the button doesn't change size when it inverts.
        default:
          "border-2 border-ink bg-ink text-white hover:bg-transparent hover:text-ink",
        accent:
          "border-2 border-pulse bg-pulse text-white hover:bg-transparent hover:text-pulse-dark hover:border-pulse-dark",
        subtle:
          "border-2 border-transparent bg-pulse-soft text-pulse-dark hover:bg-transparent hover:border-pulse-dark",
        secondary:
          "border-2 border-line bg-surface text-ink shadow-soft hover:bg-surface-sunken hover:border-line-strong",
        outline:
          "border-2 border-line-strong bg-transparent text-ink hover:bg-ink hover:text-white hover:border-ink",
        ghost: "text-ink-soft hover:bg-surface-sunken hover:text-ink",
        destructive: "border-2 border-rose-deep bg-rose-deep text-white hover:bg-transparent hover:text-rose-deep",
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
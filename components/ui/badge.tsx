import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold font-display tracking-[-0.005em] transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-ink text-white",
        accent: "border-transparent bg-pulse-soft text-pulse-dark",
        lilac: "border-transparent bg-lilac text-lilac-deep",
        apricot: "border-transparent bg-apricot text-apricot-deep",
        sky: "border-transparent bg-sky text-sky-deep",
        rose: "border-transparent bg-rose text-rose-deep",
        lemon: "border-transparent bg-lemon text-lemon-deep",
        neutral:
          "border-transparent bg-surface-sunken text-ink-soft",
        outline: "border-line-strong bg-transparent text-ink-soft",
        destructive: "border-transparent bg-rose text-rose-deep",
        secondary: "border-transparent bg-surface-sunken text-ink-soft",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

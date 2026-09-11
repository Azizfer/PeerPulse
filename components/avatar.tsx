import { cn } from "@/lib/utils"

const TINTS = [
  "bg-lilac text-lilac-deep",
  "bg-pulse-soft text-pulse-dark",
  "bg-apricot text-apricot-deep",
  "bg-sky text-sky-deep",
  "bg-rose text-rose-deep",
  "bg-lemon text-lemon-deep",
]

function tintFor(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return TINTS[hash % TINTS.length]
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function Avatar({
  name,
  src,
  size = "md",
  status,
  className,
}: {
  name: string
  src?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  status?: "online" | "offline" | "busy"
  className?: string
}) {
  const sizes = {
    xs: "h-7 w-7 text-[11px]",
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-base",
    xl: "h-20 w-20 text-xl",
  }
  const dotSizes = {
    xs: "h-2 w-2",
    sm: "h-2.5 w-2.5",
    md: "h-3 w-3",
    lg: "h-3.5 w-3.5",
    xl: "h-4 w-4",
  }

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          className={cn("rounded-full object-cover", sizes[size])}
        />
      ) : (
        <span
          className={cn(
            "grid place-items-center rounded-full font-display font-bold",
            sizes[size],
            tintFor(name || "?"),
          )}
        >
          {initials(name || "?")}
        </span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full ring-2 ring-surface",
            dotSizes[size],
            status === "online" && "bg-pulse",
            status === "busy" && "bg-apricot-deep",
            status === "offline" && "bg-ink-faint",
          )}
        />
      )}
    </span>
  )
}

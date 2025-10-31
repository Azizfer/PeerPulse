import { toast } from "@/hooks/use-toast"

/**
 * Unified toast helper with consistent styling
 * Usage: showToast.success("Title", "Description")
 */

export const showToast = {
  success: (title: string, description?: string) => {
    toast({
      title: `✓ ${title}`,
      description,
      variant: "success",
    })
  },

  error: (title: string, description?: string) => {
    toast({
      title: `✕ ${title}`,
      description,
      variant: "destructive",
    })
  },

  info: (title: string, description?: string) => {
    toast({
      title: `ℹ ${title}`,
      description,
    })
  },

  warning: (title: string, description?: string) => {
    toast({
      title: `⚠ ${title}`,
      description,
    })
  },

  // For quick actions without description
  quick: (message: string) => {
    toast({
      title: message,
    })
  },
}

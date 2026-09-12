import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInsetSafe>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-ink-soft">Dashboard</span>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </SidebarInsetSafe>
    </SidebarProvider>
  )
}

/**
 * Thin wrapper so the inset keeps the page background tokens in both themes.
 */
function SidebarInsetSafe({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-paper text-ink flex min-h-svh flex-1 flex-col">{children}</main>
  )
}

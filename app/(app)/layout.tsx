import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import "./workspace.css"

/**
 * Logged-in app shell.
 *
 * The sidebar owns navigation; the compact app header owns utilities.
 * Marketing navigation is deliberately excluded from authenticated routes.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="peerpulse-workspace bg-paper-warm" style={{ "--sidebar-width": "15.5rem" } as React.CSSProperties}>
      <AppSidebar variant="inset" />
      <SidebarInset asChild className="min-w-0 border-line bg-paper md:rounded-2xl md:border md:shadow-soft">
      <div>
        <AppHeader />
        {children}
      </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

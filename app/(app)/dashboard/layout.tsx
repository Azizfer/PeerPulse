import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
/**
 * Logged-in app shell. There is deliberately no page header — the sidebar
 * carries the trigger, the search box and the primary action, Linear-style.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-paper text-ink flex min-h-svh flex-1 flex-col">
        {children}
      </main>
    </SidebarProvider>
  )
}


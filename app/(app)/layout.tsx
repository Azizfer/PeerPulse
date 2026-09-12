import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

/**
 * Logged-in app shell.
 *
 * No page header — the sidebar carries the trigger, the search box and the
 * primary action (Linear-style). The marketing Header/Footer belong to the
 * public site only, so they are not rendered here at all.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-paper text-ink flex min-h-svh flex-1 flex-col">
        {children}
      </main>
    </SidebarProvider>
  )
}

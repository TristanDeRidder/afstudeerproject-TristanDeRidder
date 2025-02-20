import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/design/Nav/Sidebar";

import { Outlet } from "@remix-run/react";

// Make loader with check function is user jwt is in cookies
// If not redirect to login page
// If yes, return user data


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

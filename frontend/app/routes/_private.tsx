import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/design/Nav/Sidebar";
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { getSidebars } from "../core/modules/sidebar/api";

export async function loader() {
  const sidebars = await getSidebars();

  // Ensure we're returning an array of objects with the expected format
  return json({
    items: sidebars.data.map((item: any) => ({
      title: item.PageTitle,
      url: item.URL,
      icon: item.PageIcon,
    })),
  });
}

export default function Layout() {
  const { items } = useLoaderData<{
    items: { title: string; url: string; icon: string }[];
  }>();

  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

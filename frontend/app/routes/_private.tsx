import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/design/Nav/Sidebar";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { getSidebars } from "../core/modules/sidebar/api";
import { getJwtFromCookie } from "../core/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await getJwtFromCookie(request);

  if (!jwt) {
    return redirect("/signin");
  }

  const sidebars = await getSidebars();

  return json({
    items: sidebars.data.map((item: any) => ({
      title: item.PageTitle,
      url: item.URL,
      icon: item.PageIcon,
    })),
  });
};

export default function PrivateLayout() {
  const { items } = useLoaderData<{
    items: { title: string; url: string; icon: string }[];
  }>();

    const location = useLocation();
  

  return (
    <SidebarProvider>
      <AppSidebar items={items} />
      <main
        className={
          location.pathname !== "/"
            ? "w-screen px-5 lg:px-32 overflow-hidden"
            : "w-screen overflow-hidden"
        }
      >
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

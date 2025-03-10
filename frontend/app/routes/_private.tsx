import { Sidebar } from "../components/design/Nav/Sidebar";
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { LoaderFunction, json, redirect } from "@remix-run/node";
import { getSidebars } from "../core/modules/sidebar/api";
import { jwtCookie } from "../core/cookies/cookies.server";
import API from "../core/networking/API.server";

export async function action({ request }: any) {
  const jwt = jwtCookie.parse(request.headers.get("Cookie"));

  if (!jwt) {
    return redirect("/signin");
  }
  
  API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export const loader: LoaderFunction = async ({ request }) => {
  const jwt = await jwtCookie.parse(request.headers.get("Cookie"));

  if (!jwt) {
    return redirect("/signin");
  }

  API.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

  const sidebars = await getSidebars();

  return json({
    items: sidebars.data.map((item: any) => ({
      title: item.pageTitle,
      url: item.URL,
      icon: item.pageIcon,
    })),
  });
};
 
export default function PrivateLayout() {
  const { items } = useLoaderData<{
    items: { title: string; url: string; icon: string }[];
  }>();

    const location = useLocation();
  

  return (
    <div className="flex">
        <Sidebar items={items}/>
        <main
          className={
            location.pathname !== "/"
              ? "w-screen px-5 lg:px-32 overflow-hidden"
              : "w-screen overflow-hidden"
          }
        >
          <Outlet />
        </main>
    </div>
  );
}

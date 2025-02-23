// Component imports
import { getNavigation } from "../core/modules/navigations/api";
import Footer from "../components/design/Footer/Footer";
import Navigation from "../components/design/Nav/Navigation";

// Remix imports
import { Outlet, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";

export async function loader() {
  const nav = await getNavigation();

  return json({
    items: nav.map((item: any) => ({
      title: item.PageTitle,
      url: item.URL,
      icon: item.Logo,
    })
)})}

export default function PublicLayout() {
  const { items } = useLoaderData<{
    items: { title: string; url: string; logo: string }[];
  }>();

  return (
    <div>
      <header>
        <Navigation items={items} />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
          <Footer />
      </footer>
    </div>
  );
}
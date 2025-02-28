import { Outlet, useLoaderData, useLocation } from "@remix-run/react";
import Footer from "../components/design/Footer/Footer";
import Navigation from "../components/design/Nav/Navigation";
import { getImageById } from "../components/.server/images/getImage";
import { getNavigation } from "../core/modules/navigations/api";

type LoaderData = {
  images: any;
  nav: any;
};

export async function loader() {
  try {
    const images = await getImageById({ id: "3" });
    const nav = await getNavigation();

    if (!images) {
      throw new Error("No images found");
    }

    if (!nav) {
      throw new Error("No navigation found");
    }

    return {
      images: images, nav: nav.data
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function PublicLayout() {
  const location = useLocation();
  const { images } = useLoaderData() as LoaderData;
  const { nav } = useLoaderData() as LoaderData;


  return (
    <div>
      <header>
        <Navigation images={images} navLinks={nav} />
      </header>
      <main
        className={
          location.pathname !== "/"
            ? "px-5 lg:px-32 overflow-hidden"
            : "overflow-hidden"
        }
      >
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

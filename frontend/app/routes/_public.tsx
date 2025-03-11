// Remix
import { Outlet, useLoaderData, useLocation } from "@remix-run/react";

// Components
import Footer from "../components/design/Footer/Footer";
import Navigation from "../components/design/Nav/Navigation";
import { getImageById } from "../components/.server/images/getImage";

// API
import { getNavigation } from "../core/modules/navigations/api";
import { getBrands } from "../core/modules/brands/api";
import { Brand } from "../core/modules/brands/type";

// Types

type LoaderData = {
  images: any;
  nav: any;
  brands: Brand[];
};

export async function loader() {
  try {
    const images = await getImageById({ id: "3" });
    const nav = await getNavigation();
    const brands = await getBrands();


    if (!images) {
      throw new Error("No images found");
    }

    if (!nav) {
      throw new Error("No navigation found");
    }

    if (!brands?.data) {
      throw new Error("No data available");
    }

    return {
      images: images, nav: nav.data, brands: brands.data
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function PublicLayout() {
  const location = useLocation();
  const { images, nav, brands } = useLoaderData() as LoaderData;


  return (
    <>
      <header>
        <Navigation images={images} navLinks={nav} />
      </header>
      <main
        className="overflow-hidden"
      >
        <Outlet />
      </main>
      <footer className="bg-footer px-5 lg:px-32 py-10 flex flex-col md:flex-row justify-between items-start gap-10 mt-10">
        <Footer images={images} BrandLinks={brands} />
      </footer>
    </>
  );
}

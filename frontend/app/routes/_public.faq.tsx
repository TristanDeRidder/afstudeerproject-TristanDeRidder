import { useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/brands/api";

type LoaderData = {
  brands: any;
};

export async function loader() {
  const brands = await getFAQs();
    console.log(brands)

  return {
    brands,
  };
}

export default function Faq() {
    const { brands } = useLoaderData() as LoaderData;


    return (
        <div>
            
        </div>
    );
}
import { useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/faq/api";
import { MagicCard } from "../components/magicui/magicui/magic-card";


type LoaderData = {
  faqs: any;
};

export async function loader() {
  const faqs = await getFAQs();
    console.log(faqs)

  return {
    faqs,
  };
}

export default function Faq() {
    const { faqs } = useLoaderData() as LoaderData;


    return (
      <div
        className={
          "flex h-[500px] w-full flex-col gap-4 lg:h-[250px] lg:flex-row"
        }
      >
        <MagicCard
          className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl"
          gradientColor="#D9D9D955"
        >
          Magic
        </MagicCard>
        <MagicCard
          className="cursor-pointer flex-col items-center justify-center whitespace-nowrap text-4xl"
          gradientColor="#D9D9D955"
        >
          Card
        </MagicCard>
      </div>
    );
}
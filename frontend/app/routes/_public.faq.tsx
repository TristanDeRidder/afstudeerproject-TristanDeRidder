import { useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/faq/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import PrimaryTitle from "../components/design/Title/PrimaryTitle";


type LoaderData = {
  faqs: any;
};

export async function loader() {
  const faqs = await getFAQs();
    console.log(faqs.data)

  return {
    faqs: faqs.data,
  };
}

export default function Faq() {
  const { faqs } = useLoaderData() as LoaderData;

  return (
    <div className="flex flex-col gap-4 bg-white">
      <PrimaryTitle title="FAQ" />
      <Accordion
        type="single"
        collapsible
        className="flex flex-col gap-4 items-center lg:flex-row lg:flex-wrap lg:justify-between lg:items-start "
      >
        {faqs.map(
          (faq: { Question: string; Answer: string }, index: number) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-primaryHelper rounded-xl border border-primary px-10 w-full lg:w-96"
            >
              <AccordionTrigger>{faq.Question}</AccordionTrigger>
              <AccordionContent>{faq.Answer}</AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
}
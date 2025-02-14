import { useLoaderData } from "@remix-run/react";
import { getFAQs } from "../core/modules/faq/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";


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
      <Accordion type="single" collapsible>
        {faqs.map(
          (faq: { Question: string; Answer: string }, index: number) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.Question}</AccordionTrigger>
              <AccordionContent>{faq.Answer}</AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
}
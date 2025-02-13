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
    <div className="flex flex-col gap-4 bg-black">

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            {faqs.map((faq: { Question: string }, index: number) => (
              <p key={index}>{faq.Question}</p>
            ))}
          </AccordionTrigger>
          <AccordionContent>
            {faqs.map((faq: { Question: string }, index: number) => (
              <p key={index}>{faq.Answer}</p>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
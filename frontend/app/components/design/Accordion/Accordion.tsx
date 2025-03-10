import { useState } from "react";

type AccordionProps = {
    items: { question: string; answer: string }[];
};

export default function Accordion({ items }: AccordionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
      <div className="flex flex-col gap-4 items-center lg:flex-row lg:flex-wrap lg:justify-center lg:items-start lg:w-2/3 lg:mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-primaryHelper rounded-md border border-primary px-10 w-full lg:w-96 h-max py-6"
            onClick={() => toggleAccordion(index)}
          >
            <p className="font-bold">{item.question}</p>
            <div
              className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                openIndex === index ? "max-h-60" : "max-h-0"
              }`}
            >
              <p className="mt-2">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    );
}

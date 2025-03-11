"use client";

export default function BrandAnimation({ brands }: { brands: any[] }) {
  return (
    <div className="relative w-full flex flex-col gap-3 md:gap-5 lg:gap-6 py-6">
      <Marquee brands={brands} />
      <Marquee brands={brands} reverse />
    </div>
  );
}

function Marquee({
  brands,
  reverse = false,
}: {
  brands: any[];
  reverse?: boolean;
}) {
  return (
    <div className="relative flex whitespace-nowrap">
      <div
        className={`flex gap-4 min-w-max animate-marquee ${
          reverse ? "animate-reverse" : ""
        }`}
      >
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="bg-accent border rounded-lg w-28 md:w-36 lg:w-40 py-4 md:py-5 lg:py-6 text-center"
          >
            {brand.brandName}
          </div>
        ))}
      </div>
    </div>
  );
}

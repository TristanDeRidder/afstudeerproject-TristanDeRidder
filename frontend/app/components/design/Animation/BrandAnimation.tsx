"use client";

export default function BrandAnimation({ brands }: { brands: any[] }) {
  return (
    <div className="relative w-full flex flex-col gap-3 md:gap-5 lg:gap-6 py-6">
      <Marquee brands={brands} />
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
        className={`flex gap-10 min-w-max animate-marquee ${
          reverse ? "animate-reverse" : ""
        }`}
      >
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="w-20 md:w-28 lg:w-32 py-4 md:py-5 lg:py-6 text-center"
          >
            <img src={brand.logo.url} alt={brand.logo.url} />
          </div>
        ))}
      </div>
    </div>
  );
}

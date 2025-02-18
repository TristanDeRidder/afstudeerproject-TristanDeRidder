"use client";

export default function BrandAnimation({ brands }: { brands: any[] }) {
  return (
    <div className="relative w-full flex flex-col gap-6 bg-white py-6">
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
            className="bg-accent border rounded-lg p-4 py-6 w-40 text-center"
          >
            {brand.BrandName}
          </div>
        ))}
      </div>
    </div>
  );
}

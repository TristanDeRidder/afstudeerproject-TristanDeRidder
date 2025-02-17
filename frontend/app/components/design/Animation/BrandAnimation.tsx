"use client";

import { motion } from "framer-motion";

export default function BrandAnimation({ brands }: { brands: any[] }) {
  return (
    <div className="w-full bg-white py-6">
      <div className="relative flex flex-col w-full">
        {/* Eerste rij */}
        <Marquee brands={brands} />

      </div>
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
    <motion.div
      className="flex gap-4 min-w-full"
      initial={{ x: reverse ? "0%" : "-100%" }}
      animate={{
        x: reverse ? ["0%", "-100%", "-200%"] : ["100%", "0%", "-100%"], // Zorgt voor een doorlopende animatie
      }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 15, // Je kunt hier de snelheid aanpassen
        times: [0, 0.8, 1], // Dit zorgt voor een soepelere overgang
      }}
    >
      {brands.concat(brands).map((brand, index) => (
        <div
          key={index}
          className="bg-accent border rounded-lg p-4 py-6 w-40 text-center"
        >
          {brand.BrandName}
        </div>
      ))}
    </motion.div>
  );
}

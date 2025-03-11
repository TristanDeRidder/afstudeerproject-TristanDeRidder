import { Link } from "@remix-run/react";
import Button from "../Button/Button";

interface BrandLink {
  id: string;
  brandName: string;
}

export default function Footer({
  images,
  BrandLinks,
}: {
  images: any;
  BrandLinks: any;
}) {
  return (
    <>
      {images && (
        <img
          src={images.url}
          alt={images.name}
          className="h-20 md:h-28 w-auto mb-5 md:mb-0"
        />
      )}

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <p className="text-primary text-base md:text-lg font-semibold">
          Merken:
        </p>
        {BrandLinks.slice(0, 4).map((brand: BrandLink) => (
          <Link
            key={brand.id}
            to="/"
            className="text-primary hover:text-secondary text-sm md:text-base"
          >
            {brand.brandName}
          </Link>
        ))}
        <Link
          to="/repair"
          className="text-primary hover:text-secondary text-sm md:text-base"
        >
          Alle reparaties
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <p className="text-primary text-base md:text-lg font-semibold">
          Volg ons:
        </p>
        <Link
          to="https://www.facebook.com/Fixitaalst"
          className="text-primary hover:text-secondary text-sm md:text-base"
        >
          Facebook
        </Link>
        <Link
          to="https://www.instagram.com/fixitaalst/"
          className="text-primary hover:text-secondary text-sm md:text-base"
        >
          Instagram
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full md:w-auto">
        <p className="text-primary text-base md:text-lg font-semibold">
          Contact
        </p>
        <a
          href="tel:+32477220778"
          className="text-primary hover:text-secondary text-sm md:text-base"
        >
          0477 22 07 78
        </a>
        <a
          href="mailto:kevin@fixitaalst.be"
          className="text-primary hover:text-secondary text-sm md:text-base"
        >
          kevin@fixitaalst.be
        </a>
      </div>

      <Button url="/contact" title="Contacteer ons" />
    </>
  );
}

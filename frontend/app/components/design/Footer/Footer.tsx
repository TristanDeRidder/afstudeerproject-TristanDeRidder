import { Link } from "@remix-run/react";
import Button from "../Button/Button";

interface BrandLink {
  id: string;
  BrandName: string;
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
        <img src={images.url} alt={images.name} className="h-28 w-auto mr-4" />
      )}

      <div className="flex flex-col gap-2">
        {BrandLinks.slice(0, 4).map((brand: BrandLink) => (
          <Link
            key={brand.id}
            to={`/`}
            className="text-primary hover:text-secondary"
          >
            {brand.BrandName}
          </Link>
        ))}
        <Link to="/repair" className="text-primary hover:text-secondary">
          Alle reparaties
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary text-lg">Volg ons:</p>
        <Link
          to="https://www.facebook.com/Fixitaalst"
          className="text-primary hover:text-secondary"
        >
          Facebook
        </Link>
        <Link
          to="https://www.instagram.com/fixitaalst/"
          className="text-primary hover:text-secondary"
        >
          Instagram
        </Link>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-primary text-lg">Contact</p>
        <a href="tel:+32477220778" className="text-primary hover:text-secondary">
          0477 22 07 78
        </a>
        <a
          href="mailto:kevin@fixitaalst.be"
          className="text-primary hover:text-secondary"
        >
          kevin@fixitaalst.be
        </a>
      </div>
      <Button
        url="/contact"
        title="Contacteer ons"
        />
    </>
  );
}

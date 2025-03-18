import { Link } from "@remix-run/react";
import Button from "../Button/Button";

import Facebook from "../../../assets/svg/facebook.svg";
import Instagram from "../../../assets/svg/Instagram.svg";

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
    <footer className="bg-footer flex flex-col gap-10 px-5 lg:px-32 py-10 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        {images && (
          <img
            src={images.url}
            alt={images.name}
            className="h-20 md:h-36 w-auto mb-5 md:mb-0"
          />
        )}

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <p className="text-primary text-base md:text-lg font-semibold">
            Links:
          </p>
          <Link
            to="/over"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            Over ons
          </Link>
          <Link
            to="/moederbord"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            Moederbord
          </Link>
          <Link
            to="/bescherming"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            Bescherming
          </Link>
          <Link
            to="/B2B"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            B2B
          </Link>
          <Link
            to="/FAQ"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            FAQ
          </Link>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <p className="text-primary text-base md:text-lg font-semibold">
            Merken:
          </p>
          {BrandLinks.slice(0, 4).map((brand: BrandLink) => (
            <Link
              key={brand.id}
              to="/herstelling"
              className="text-primary hover:text-accent text-sm md:text-base"
            >
              {brand.brandName}
            </Link>
          ))}
          <Link
            to="/repair"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            Alle reparaties
          </Link>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <p className="text-primary text-base md:text-lg font-semibold">
            Contact
          </p>
          <a
            href="tel:+32477220778"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            0477 22 07 78
          </a>
          <a
            href="mailto:kevin@fixitaalst.be"
            className="text-primary hover:text-accent text-sm md:text-base"
          >
            kevin@fixitaalst.be
          </a>
        </div>

        <div className="flex flex-col gap-4 w-full md:w-auto">
          <Button url="/contact" title="Contacteer ons" />
          <div className="flex flex-col gap-4 w-full md:w-auto">
            <p className="text-primary text-base md:text-lg font-semibold">
              Volg ons:
            </p>
            <div className="flex items-center gap-4">
              <Link
                to="https://www.facebook.com/Fixitaalst"
                className="group border border-bg rounded-full p-2 hover:border-accent text-sm md:text-base transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="facebook"
                  width="25"
                  height="25"
                  viewBox="0 0 100 100"
                  className="fill-white group-hover:fill-accent transition-colors duration-300"
                >
                  <path d="M38.078 22.431v12.391H29v15.152h9.078V95h18.648V49.975H69.24s1.172-7.265 1.74-15.209H56.797v-10.36c0-1.548 2.033-3.631 4.043-3.631H71V5.001H57.186C37.617 5 38.078 20.167 38.078 22.431"></path>
                </svg>
              </Link>

              <Link
                to="https://www.instagram.com/fixitaalst/"
                className="group border border-bg rounded-full p-2 hover:border-accent text-sm md:text-base transition-colors duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="instagram"
                  width="25"
                  height="25"
                  viewBox="0 0 20 20"
                  className="fill-white group-hover:fill-accent transition-colors duration-300"
                >
                  <path d="M18.946 6.29a6.606 6.606 0 0 0-.418-2.185 4.412 4.412 0 0 0-1.039-1.594 4.412 4.412 0 0 0-1.594-1.039 6.606 6.606 0 0 0-2.184-.418C12.75 1.01 12.444 1 10 1s-2.75.01-3.71.054a6.606 6.606 0 0 0-2.185.418A4.412 4.412 0 0 0 2.51 2.511a4.412 4.412 0 0 0-1.039 1.594 6.606 6.606 0 0 0-.418 2.184C1.01 7.25 1 7.556 1 10s.01 2.75.054 3.71a6.606 6.606 0 0 0 .418 2.185 4.412 4.412 0 0 0 1.039 1.594 4.411 4.411 0 0 0 1.594 1.039 6.606 6.606 0 0 0 2.184.418C7.25 18.99 7.556 19 10 19s2.75-.01 3.71-.054a6.606 6.606 0 0 0 2.185-.418 4.602 4.602 0 0 0 2.633-2.633 6.606 6.606 0 0 0 .418-2.184C18.99 12.75 19 12.444 19 10s-.01-2.75-.054-3.71zm-1.62 7.347a4.978 4.978 0 0 1-.31 1.67 2.98 2.98 0 0 1-1.708 1.709 4.979 4.979 0 0 1-1.671.31c-.95.043-1.234.052-3.637.052s-2.688-.009-3.637-.052a4.979 4.979 0 0 1-1.67-.31 2.788 2.788 0 0 1-1.036-.673 2.788 2.788 0 0 1-.673-1.035 4.978 4.978 0 0 1-.31-1.671c-.043-.95-.052-1.234-.052-3.637s.009-2.688.052-3.637a4.979 4.979 0 0 1 .31-1.67 2.788 2.788 0 0 1 .673-1.036 2.788 2.788 0 0 1 1.035-.673 4.979 4.979 0 0 1 1.671-.31c.95-.043 1.234-.052 3.637-.052s2.688.009 3.637.052a4.979 4.979 0 0 1 1.67.31 2.788 2.788 0 0 1 1.036.673 2.788 2.788 0 0 1 .673 1.035 4.979 4.979 0 0 1 .31 1.671c.043.95.052 1.234.052 3.637s-.009 2.688-.052 3.637zM10 5.378A4.622 4.622 0 1 0 14.622 10 4.622 4.622 0 0 0 10 5.378zM10 13a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5.884-7.804a1.08 1.08 0 1 1-1.08-1.08 1.08 1.08 0 0 1 1.08 1.08z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="text-primary text-sm md:text-base">
          © 2025 Fixit Aalst. Alle rechten voorbehouden.
        </p>
      </div>
    </footer>
  );
}

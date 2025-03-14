import { useState } from "react";
import { NavLink } from "@remix-run/react";

import CloseIcon from "../../../assets/svg/X_Icon.svg";
import MenuIcon from "../../../assets/svg/Menu_Icon.svg";

interface NavLink {
  URL: string;
  pageTitle: string;
}

const customOrder = [
  "Herstellingen",
  "Over",
  "FAQ",
  "Contact",
];

export default function Navigation({
  images,
  navLinks,
}: {
  images: any;
  navLinks: NavLink[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Sort navLinks according to custom order
  const sortedNavLinks = navLinks.sort((a, b) => {
    return customOrder.indexOf(a.pageTitle) - customOrder.indexOf(b.pageTitle);
  });

  return (
    <nav className="relative bg-white p-4 pb-9 md:pb-12">
      {/* Desktop navigation */}
      <div className="hidden md:flex justify-between gap-6 items-center px-5 lg:px-32">
        <NavLink to="/" className="flex items-center gap-4">
          {images && (
            <img
              src={images.url}
              alt={images.name}
              className="h-28 w-auto mr-4"
            />
          )}
        </NavLink>
        <div className="flex gap-4 items-center">
          {sortedNavLinks.map(({ URL, pageTitle }) => (
            <NavLink
              key={URL}
              to={URL}
              className={({ isActive }) =>
                `transition-colors duration-200 px-4 py-2 rounded-full ${
                  pageTitle.toLowerCase() === "contact"
                    ? "bg-accent text-white font-bold rounded-lg px-6 py-4 border hover:bg-bg hover:border-secondary hover:text-text transition-all duration-200 ease-in-out"
                    : isActive
                    ? "text-secondary font-semibold bg-accent"
                    : "text-text hover:text-accentLight"
                }`
              }
            >
              {pageTitle || "Home"}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex justify-between items-center">
        <button
          className="text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
        >
          <img src={MenuIcon} alt="Menu" />
        </button>
      </div>

      {/* Fullscreen overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50 transition-opacity duration-300">
          <button
            className="absolute top-6 left-6 text-text p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Close navigation"
          >
            <img src={CloseIcon} alt="Close" />
          </button>

          <div className="flex flex-col gap-6 text-center">
            {sortedNavLinks.map(({ URL, pageTitle }) => (
              <NavLink
                key={URL}
                to={URL}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-semibold transition-colors duration-200 ${
                    pageTitle.toLowerCase() === "contact"
                      ? "bg-secondary text-white font-bold hover:bg-secondaryLight p-4 rounded-lg"
                      : isActive
                      ? "text-accent"
                      : "text-text hover:text-primary"
                  }`
                }
              >
                {pageTitle || "Home"}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

import { useState } from "react";
import { NavLink } from "@remix-run/react";
import { Menu, X } from "lucide-react";

interface NavLinkItem {
  title: string;
  url: string;
  logo: string;
}

const customOrder = [
  "Home",
  "Herstellingen",
  "Status",
  "Over",
  "Contact",
];

export default function Navigation({ items }: { items: NavLinkItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white p-4 pb-9 md:pb-12">
      {/* Desktop navigatie */}
      <div className="hidden md:flex justify-center gap-6">
        {items
          .sort((a, b) => {
            const indexA = customOrder.indexOf(a.title);
            const indexB = customOrder.indexOf(b.title);

            return (
              (indexA !== -1 ? indexA : 999) - (indexB !== -1 ? indexB : 999)
            );
          })
          .map(({ title, url, logo }) => (
            <NavLink
              key={title}
              to={url}
              className={({ isActive }) =>
                `text-xl font-semibold transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-text hover:text-primary"
                }`
              }
            >
              <img src={logo} alt={title} className="h-8" />
            </NavLink>
          ))}
      </div>

      {/* Hamburger menu knop (mobiel) */}
      <div className="md:hidden flex justify-between items-center">
        <button
          className="text-gray-700 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigatie"
        >
          <Menu size={28} />
        </button>
      </div>

      {/* Fullscreen overlay navigatie (mobiel) */}
      {isOpen && (
        <div className="fixed inset-0 bg-bg flex flex-col items-center justify-center z-50 transition-opacity duration-300">
          {/* Sluitknop */}
          <button
            className="absolute top-6 left-6 text-text p-2"
            onClick={() => setIsOpen(false)}
            aria-label="Sluit navigatie"
          >
            <X size={32} />
          </button>

          {/* Navigatie-items */}
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-2xl font-semibold transition-colors duration-200 ${
                    isActive ? "text-accent" : "text-text hover:text-primary"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

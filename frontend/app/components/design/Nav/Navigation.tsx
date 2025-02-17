import { useState } from "react";
import { NavLink } from "@remix-run/react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/repair", label: "Herstellingen" },
  { to: "/status", label: "Status" },
  { to: "/about", label: "Over" },
  { to: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-white  p-4">
      {/* Desktop navigatie */}
      <div className="hidden md:flex justify-center gap-6">
        {navLinks.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `transition-colors duration-200 px-4 py-2 rounded-lg ${
                isActive
                  ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              }`
            }
          >
            {label}
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
            className="absolute top-6 right-6 text-text p-2"
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
                    isActive
                      ? "text-blue-400"
                      : "text-text hover:text-accent"
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

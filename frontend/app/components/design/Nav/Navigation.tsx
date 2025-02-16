import { NavLink } from "@remix-run/react";

const navLinks = [
  { to: "/herstellingen", label: "Herstellingen" },
  { to: "/status", label: "Status" },
  { to: "/over", label: "Over" },
  { to: "/contact", label: "Contact" },
];

export default function Navigation() {
  return (
    <nav className="flex gap-4">
      {navLinks.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive, isPending }) =>
            `transition-colors duration-200 px-4 py-2 rounded-lg ${
              isActive
                ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                : isPending
                ? "text-teal-500"
                : "text-gray-500 hover:text-gray-700"
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

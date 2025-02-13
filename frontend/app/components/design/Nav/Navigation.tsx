import { NavLink } from "@remix-run/react"

export default function Navigation() {
    return (
      <nav>
        <div>
          <img src="" alt="" />
        </div>
        <div>
          <NavLink
            to="/Herstellingen"
            className={({ isActive, isPending }) =>
              isActive
                ? "color-blue-500"
                : isPending
                ? "color-teal-500"
                : "color-gray-500"
            }
          >
            Herstellingen
          </NavLink>
          <NavLink
            to="/Status"
            className={({ isActive, isPending }) =>
              isActive
                ? "color-blue-500"
                : isPending
                ? "color-teal-500"
                : "color-gray-500"
            }
          >
            Status
          </NavLink>
          <NavLink
            to="/Over"
            className={({ isActive, isPending }) =>
              isActive
                ? "color-blue-500"
                : isPending
                ? "color-teal-500"
                : "color-gray-500"
            }
          >
            Over
          </NavLink>
          <NavLink
            to="/Contact"
            className={({ isActive, isPending }) =>
              isActive
                ? "color-blue-500"
                : isPending
                ? "color-teal-500"
                : "color-gray-500"
            }
          >
            Contact
          </NavLink>
        </div>
      </nav>
    );
}
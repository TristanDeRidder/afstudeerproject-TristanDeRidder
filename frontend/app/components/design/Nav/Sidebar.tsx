import React, { useState } from "react";
import { useLocation } from "@remix-run/react";
import Bolt from "../../../assets/svg/Bolt_Icon.svg";
import CreditCard from "../../../assets/svg/Credit_Card_Icon.svg";
import House from "../../../assets/svg/House_Icon.svg";
import Inbox from "../../../assets/svg/Inbox_Icon.svg";
import Book from "../../../assets/svg/Open_Book_Icon.svg";
import Smartphone from "../../../assets/svg/Smartphone_Icon.svg";
import List from "../../../assets/svg/List_Icon.svg";
import Globe from "../../../assets/svg/Globe_Icon.svg";

import DoubleLeft from "../Icons/DoubleLeft";
import DoubleRight from "../Icons/DoubleRight";

interface SidebarItem {
  title: string;
  url: string;
  icon: string;
}

const iconMap: { [key: string]: string } = {
  Bolt,
  CreditCard,
  House,
  Inbox,
  Book,
  Smartphone,
  List,
  Globe,
};

export function Sidebar({ items }: { items: SidebarItem[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className="flex items-center justify-center h-screen text-dashboardText">
      <div
        className={`flex flex-col items-center h-full text-dashboardText bg-dashboardSidebar shadow-lg transition-all duration-300 relative ${
          isCollapsed ? "w-16" : "w-40"
        }`}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="py-1 px-2 text-dashboardText bg-dashboardSidebar rounded-r-md absolute -right-10 top-10"
        >
          {isCollapsed ? <DoubleRight /> : <DoubleLeft />}
        </button>

        <a className="flex items-center w-full px-3 mt-3" href="#">
          <svg
            className="w-8 h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
          {!isCollapsed && (
            <span className="ml-2 text-sm font-bold">Fixit</span>
          )}
        </a>

        <div className="w-full mt-5">
          <div className="flex flex-col items-start border-t border-gray-700">
            {items.map((item) => {
              const IconComponent = iconMap[item.icon] || List;
              const isActive = location.pathname === item.url;

              return (
                <a
                  key={item.title}
                  href={item.url}
                  className={`flex items-center w-full h-12 px-4 mt-2 transition-all duration-300 ${
                    isActive
                      ? "border-l-4 border-dashboardPrimary text-text hover:bg-dashboardPrimaryHelper"
                      : "hover:bg-dashboardPrimaryHelper hover:text-text"
                  }`}
                >
                  <img
                    className="w-6 h-6"
                    src={IconComponent}
                    alt={item.title}
                  />
                  {!isCollapsed && (
                    <span className="ml-2 text-sm font-medium">
                      {item.title}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

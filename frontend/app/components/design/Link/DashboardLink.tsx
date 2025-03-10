import { Link } from "@remix-run/react";

import Arrow from "../Icons/Arrow";


export default function DashboardLink({
    url
}:{
    url: string
}) {
  return (
    <Link
      to={url}
      className="block bg-dashboardBg rounded-full p-3 text-dashboardPrimaryHelper rotate-45 hover:bg-dashboardPrimaryHelper hover:text-dashboardBg hover:rotate-0 transition-all duration-500 ease-in-out"
    >
      <Arrow />
    </Link>
  );
}

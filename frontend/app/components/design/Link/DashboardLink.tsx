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
      className="block bg-primaryHelper rounded-full p-3 text-accent rotate-45 hover:bg-accent hover:text-primary hover:rotate-0 transition-all duration-500 ease-in-out"
    >
      <Arrow />
    </Link>
  );
}

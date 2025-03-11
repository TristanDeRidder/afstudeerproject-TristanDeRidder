import { Link } from "@remix-run/react";
import Arrow from "../Icons/Arrow";

export default function RepairCard({
  title,
  images,
  url,
}: {
  title: string;
  images: any;
  url: string;
}) {
  return (
    <Link
      to={url}
      className="group text-3xl font-bold bg-primaryHelper p-4 md:p-6 lg:p-10 rounded-xl flex flex-col justify-between items-start md:items-center lg:items-center gap-2 md:gap-6 lg:gap-10 border border-primaryHelper hover:bg-accentLight hover:border-accent transition-all overflow-hidden"
    >
      <div className="w-48 text-2xl md:text-2xl lg:text-3xl">{title}</div>

      <div className="relative h-28 md:h-36 lg:h-48 w-64 md:w-48 lg:w-60 flex items-center">
        {images && (
          <img
            src={images}
            alt={title}
            className="absolute -right-40 md:-right-28 lg:-right-24 w-72 max-w-none h-auto -rotate-12"
          />
        )}
        <span className="absolute left-0 bottom-0 bg-primaryHelper rounded-full p-3 text-accent border border-accent rotate-45 group-hover:bg-primaryHelper group-hover:text-accent group-hover:-rotate-45 group-hover:p-3 transition-all duration-500 ease-in-out">
          <Arrow />
        </span>
      </div>
    </Link>
  );
}

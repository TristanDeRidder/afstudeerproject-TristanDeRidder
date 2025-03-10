import { Link } from "@remix-run/react";
import Arrow from "../Icons/Arrow";

export default function RepairCard({title, images, url}: {title: string, images: any, url: string}) {    
    return (
      <Link
        to={url}
        className="group text-3xl font-bold bg-primaryHelper p-10 rounded-lg flex flex-col justify-between items-center gap-10 border border-primaryHelper hover:bg-accentLight hover:border-accent transition-all overflow-hidden"
      >
        <div className="w-48">{title}</div>

        <div className="relative h-48 w-64 flex items-center">
          {images && (
            <img
              src={images}
              alt={title}
              className="absolute -right-24 w-72 max-w-none h-auto -rotate-12"
            />
          )}
          <span className="absolute left-0 bottom-0 bg-primaryHelper rounded-full p-3 text-accent border border-accent rotate-45 group-hover:bg-primaryHelper group-hover:text-accent group-hover:-rotate-45 group-hover:p-' transition-all duration-500 ease-in-out">
            <Arrow />
          </span>
        </div>
      </Link>
    );
}
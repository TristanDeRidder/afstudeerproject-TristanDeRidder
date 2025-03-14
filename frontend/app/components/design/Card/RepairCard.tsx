import { Link } from "@remix-run/react";

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
      className="group text-2xl sm:text-3xl font-bold bg-primaryHelper p-4 md:p-6 lg:p-8 xl:p-10 rounded-xl flex flex-col justify-between items-start md:items-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 border border-primaryHelper hover:bg-accentLight hover:border-accent transition-all duration-500 ease-in-out overflow-hidden max-w-screen-lg"
    >
      <div className="w-40 sm:w-48 md:w-56 lg:w-64 xl:w-72 text-xl sm:text-2xl md:text-3xl lg:text-4xl">
        {title}
      </div>

      <div className="relative h-24 sm:h-28 md:h-32 lg:h-40 xl:h-48 w-56 sm:w-64 md:w-72 lg:w-80 xl:w-96 flex items-center">
        {images && (
          <img
            src={images}
            alt={title}
            className="absolute -right-32 md:-right-24 lg:-right-20 xl:-right-16 w-64 sm:w-72 md:w-80 max-w-none h-auto -rotate-12"
          />
        )}
        <span className="absolute left-8 bottom-0 bg-primaryHelper rounded-full p-4 text-text border border-text rotate-45 group-hover:bg-accentLight group-hover:-rotate-45 transition-all duration-500 ease-in-out">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="#f5f5f7"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:w-[26px] group-hover:h-[26px] transition-all duration-500 ease-in-out"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M2 12H22" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

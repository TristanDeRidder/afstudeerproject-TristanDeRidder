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
      className="group text-3xl font-bold bg-primaryHelper p-4 md:p-6 lg:p-10 xl:p-12 2xl:p-16 rounded-xl flex flex-col justify-between items-start md:items-center gap-2 md:gap-6 lg:gap-10 2xl:gap-14 border border-primaryHelper hover:bg-accentLight hover:border-accent transition-all duration-500 ease-in-out overflow-hidden"
    >
      <div className="w-48 md:w-64 lg:w-72 xl:w-80 2xl:w-96 text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl">
        {title}
      </div>

      <div className="relative h-28 md:h-36 lg:h-48 xl:h-56 2xl:h-72 w-64 md:w-72 lg:w-80 xl:w-96 flex items-center">
        {images && (
          <img
            src={images}
            alt={title}
            className="absolute -right-40 md:-right-28 lg:-right-24 2xl:-right-20 w-72 md:w-96 max-w-none h-auto -rotate-12"
          />
        )}
        <span className="absolute left-0 bottom-0 2xl:-left-8 bg-primaryHelper rounded-full p-4 2xl:p-6 text-text border border-text rotate-45 group-hover:bg-accentLight group-hover:-rotate-45 transition-all duration-500 ease-in-out">
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

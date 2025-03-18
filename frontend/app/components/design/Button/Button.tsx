import { Link } from "@remix-run/react";

export default function Button({ title, url }: { title: string; url: string }) {
    return (
      <Link
        to={url}
        className="w-full md:w-auto mt-5 md:mt-0 bg-bg text-text p-3 rounded-lg hover:bg-accent hover:text-text transition-all duration-300 ease-in-out"
      >
        {title}
      </Link>
    );
}

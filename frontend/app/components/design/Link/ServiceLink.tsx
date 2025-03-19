import { Link } from "@remix-run/react";

export default function ServiceLink({url, text}:{url: string, text: string}) {
    return (
      <Link
        to={url}
        className="block text-center text-lg md:text-xl text-secondary font-bold bg-primary border border-primaryHelper rounded-lg p-4 hover:bg-accent transition-all duration-300"
      >
        {text}
        <p className="text-base text-secondary font-normal">Klik voor meer informatie</p>
      </Link>
    );
}
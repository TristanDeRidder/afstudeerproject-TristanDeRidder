import { Link } from "@remix-run/react";

export default function Button({ title, url }: { title: string; url: string }) {
    return (
        <Link to={url} className="bg-accent text-primary p-3 rounded-lg hover:bg-accentLight hover:text-text transition-all duration-300 ease-in-out">
            {title}
        </Link>
    )
}
import { twMerge } from "tailwind-merge";

export default function Button({
    as = "button",
    children,
    type = "button",
    className = "",
    color = "default",
    href,
    download,
}: {
    children: React.ReactNode;
    as?: "button" | "a";
    type?: "button" | "submit";
    className?: string;
    color?: "default" | "emphasis";
    href?: string;
    download?: boolean;
}) {
    const _className = twMerge(
        "px-3 py-1.5 border-2 border-black rounded-full block w-max font-semibold bg-white hover:bg-black hover:text-white transition-colors duration-150",
        color === "emphasis" && "bg-red-500 text-white",
        className
    );

    if (as === "a") {
        return (
            <a href={href} download={download} className={_className}>
                {children}
            </a>
        );
    }

    if (as === "button") {
        return (
            <button type={type} className={_className}>
                {children}
            </button>
        );
    }
}

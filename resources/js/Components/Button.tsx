import { twMerge } from "tailwind-merge";

interface CustomButtonProps extends React.HTMLProps<HTMLButtonElement> {
    children: React.ReactNode;
    as?: "button";
    type?: "button" | "submit";
    className?: string;
    color?: "default" | "emphasis";
}

export default function Button({
    as = "button",
    children,
    type = "button",
    className = "",
    color = "default",
    ...attributes
}: CustomButtonProps) {
    const Element = as;
    return (
        <Element
            className={twMerge(
                "px-3 py-1.5 border-2 border-black rounded-full block w-max font-semibold bg-white hover:bg-black hover:text-white transition-colors duration-150",
                color === "emphasis" && "bg-red-500 text-white",
                className
            )}
            type={type}
            {...attributes}
        >
            {children}
        </Element>
    );
}

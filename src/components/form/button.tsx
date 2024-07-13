import { twMerge } from "tailwind-merge";

export default function Button({
  type = "submit",
  variant = "default",
  className,
  children,
  ...props
}: {
  type?: "submit" | "button";
  variant?: "default" | "submit";
  className?: string;
  children: React.ReactNode;
} & React.ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={twMerge(
        "px-3 py-1.5 border-2 border-black rounded-full block w-max font-semibold bg-white hover:bg-black hover:text-white transition-colors duration-150",
        variant === "submit" && "bg-red-500 text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

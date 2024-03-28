import { twMerge } from "tailwind-merge";

interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  pre?: string | React.ReactNode;
  type?: "text" | "number" | "email";
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  pre,
  type = "text",
  error,
  onChange,
  ...attributes
}: CustomInputProps) {
  return (
    <div>
      {label && <label className="block font-medium mb-0.5">{label}</label>}
      <div
        className={twMerge(
          "border-2 border-black bg-white has-[:focus]:border-red-500 has-[:focus]:ring-1 has-[:focus]:ring-red-500",
          pre && "grid grid-cols-[max-content,1fr]",
        )}
        data-input
      >
        {pre && (
          <div
            className={twMerge(
              "flex-shrink-0 pl-2 pr-2 h-full bg-gray-100 text-gray-500 font-medium text-sm border-r-2 border-black",
              "flex items-center",
            )}
          >
            <div>{pre}</div>
          </div>
        )}
        <input
          type={type}
          onChange={onChange}
          {...attributes}
          className="block border-none w-full font-medium focus:ring-0"
        />
      </div>
      {error && (
        <p className="mt-0.5 text-red-500 text-sm font-medium">{error}</p>
      )}
    </div>
  );
}

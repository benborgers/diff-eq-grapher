import * as Form from "@radix-ui/react-form";
import { twMerge } from "tailwind-merge";

export default function InputBoxy({
  name,
  label,
  type = "text",
  prefix,
  ...props
}: {
  name: string;
  label: string | null;
  type?: string;
  prefix?: string;
} & React.ComponentProps<"input">) {
  return (
    <Form.Field name={name}>
      <Form.Label className="font-medium">{label}</Form.Label>
      <div
        className={twMerge(
          "mt-0.5",
          prefix && "grid grid-cols-[max-content,1fr]"
        )}
      >
        {prefix && (
          <div
            className={twMerge(
              "text-red-300 px-2 border-2 border-r-0 border-black bg-gray-100",
              "flex items-center"
            )}
          >
            <span className="text-sm font-medium text-gray-500">{prefix}</span>
          </div>
        )}
        <Form.Control asChild>
          <input
            type={type}
            className="w-full font-medium border-2 border-black bg-white focus:ring-red-500 focus:border-red-500"
            {...props}
          />
        </Form.Control>
      </div>
    </Form.Field>
  );
}

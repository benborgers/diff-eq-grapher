import * as Form from "@radix-ui/react-form";
import { twMerge } from "tailwind-merge";

export default function InputBoxy({
  name,
  label,
  type = "text",
  prefix,
  validation = {},
  ...props
}: {
  name: string;
  label: string | null;
  type?: string;
  prefix?: string;
  validation?: Record<string, Form.FormMessageProps["match"]>;
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
            required={Object.values(validation).includes("valueMissing")}
          />
        </Form.Control>
      </div>
      {Object.keys(validation).map((message) => (
        <Form.Message
          key={validation[message]?.toString()}
          match={validation[message]}
          className="mt-1 text-red-600 text-sm font-medium"
          asChild
        >
          <p>{message}</p>
        </Form.Message>
      ))}
    </Form.Field>
  );
}

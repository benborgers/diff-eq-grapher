interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
    label?: string;
    type?: "text" | "number" | "email";
    error?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
    label,
    type = "text",
    error,
    onChange,
    ...attributes
}: CustomInputProps) {
    return (
        <div>
            {label && <label className="font-medium">{label}</label>}
            <input
                type={type}
                onChange={onChange}
                {...attributes}
                className="block border-2 border-black w-full font-medium focus:border-red-500 focus:ring-red-500"
            />
            {error && (
                <p className="mt-0.5 text-red-500 text-sm font-medium">
                    {error}
                </p>
            )}
        </div>
    );
}

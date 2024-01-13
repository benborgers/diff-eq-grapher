interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
    label: string;
    type?: "text" | "number";
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
    label,
    type = "text",
    onChange,
    ...attributes
}: CustomInputProps) {
    return (
        <div>
            <label className="font-medium">{label}</label>
            <input
                type={type}
                onChange={onChange}
                {...attributes}
                className="block border-2 border-black w-full font-medium focus:border-red-500 focus:ring-red-500"
            />
        </div>
    );
}

import { useForm } from "@inertiajs/react";

export default function () {
    const { post } = useForm();

    return (
        <div>
            <button onClick={() => post(route("graph.execute"))}>
                execute
            </button>
        </div>
    );
}

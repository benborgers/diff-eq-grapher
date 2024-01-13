import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";

const EMPTY_EQUATION = () => ({ value: "", initialCondition: 1 });

export default function (props: PageProps) {
    const { post, data, setData } = useForm<{
        equations: {
            value: string;
            initialCondition: number;
        }[];
        timeMax: number;
    }>({
        equations: [EMPTY_EQUATION()],
        timeMax: 20,
    });

    console.log(props);

    return (
        <div>
            {data.equations.map((equation, i) => (
                <div key={i}>
                    <input
                        type="text"
                        value={equation.value}
                        onChange={(e) => {
                            const equations = [...data.equations];
                            equations[i].value = e.target.value;
                            setData("equations", equations);
                        }}
                    />

                    <input
                        type="number"
                        value={equation.initialCondition}
                        onChange={(e) => {
                            const equations = [...data.equations];
                            equations[i].initialCondition = Number(
                                e.target.value
                            );
                            setData("equations", equations);
                        }}
                    />

                    <button
                        onClick={() => {
                            const equations = [...data.equations];
                            equations.splice(i, 1);
                            setData("equations", equations);
                        }}
                    >
                        Delete
                    </button>
                </div>
            ))}

            <button
                onClick={() => {
                    const equations = [...data.equations];
                    equations.push(EMPTY_EQUATION());
                    setData("equations", equations);
                }}
            >
                Add equation
            </button>

            <button
                onClick={() => {
                    post(route("graph.execute"), {
                        preserveScroll: true,
                        preserveState: true,
                    });
                }}
            >
                EXECUTE
            </button>

            {props.flash.graph_id && (
                <img src={route("graph.image", props.flash.graph_id)} />
            )}
        </div>
    );
}

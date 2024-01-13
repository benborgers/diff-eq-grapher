import Button from "@/Components/Button";
import Input from "@/Components/Input";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";

export default function (props: PageProps) {
    const { post, data, setData, errors } = useForm<{
        equations: {
            value: string;
            initialCondition: number;
        }[];
        timeMax: number;
    }>({
        equations: [
            {
                // value: "cos(2 * pi * t) * y - sin(pi * t)^2",
                value: "cos(2 pi t)y - sin(pi t)^2",
                initialCondition: 1,
            },
        ],
        timeMax: 20,
    });

    // props.flash.graph_id = "9ZnYD7N7ihg3GOZN";

    return (
        <div className="p-4 sm:p-8 sm:pb-4 grid min-h-screen grid-rows-[max-content,1fr,max-content] grid-cols-[1.5fr,1fr]">
            <div className="col-span-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    Differential Equation Grapher
                </h1>

                <p className="mt-1 text-black/50">
                    <strong>Note: </strong> Use multiplication symbols (e.g. 4 *
                    y) instead of implicit multiplication (e.g. 4y).
                </p>
            </div>

            <div className="border-r-2 border-black/10 border-dashed mr-8 pr-8">
                <div className="mt-8 space-y-4">
                    {data.equations.map((equation, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-[1fr,200px,max-content] gap-x-6 items-end"
                        >
                            <Input
                                label="Differential equation"
                                type="text"
                                value={equation.value}
                                onChange={(e) => {
                                    const equations = [...data.equations];
                                    equations[i].value = e.target.value;
                                    setData("equations", equations);
                                }}
                            />

                            <Input
                                label="Initial condition"
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

                            <Button
                                onClick={() => {
                                    const equations = [...data.equations];
                                    equations.splice(i, 1);
                                    setData("equations", equations);
                                }}
                                className="h-[43px] px-4"
                            >
                                Remove
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex gap-x-4">
                    <Button
                        onClick={() => {
                            const equations = [...data.equations];
                            equations.push({ value: "", initialCondition: 1 });
                            setData("equations", equations);
                        }}
                    >
                        + Add equation
                    </Button>

                    <Button
                        onClick={() => {
                            post(route("graph.execute"), {
                                preserveScroll: true,
                                preserveState: true,
                            });
                        }}
                        color="emphasis"
                    >
                        GRAPH &rarr;
                    </Button>
                </div>
            </div>

            <div>
                {props.flash.graph_id && (
                    <div>
                        <img
                            src={route("graph.image", props.flash.graph_id)}
                            className="border-2 border-black"
                        />
                        <div className="mt-4">
                            <Button
                                href={route(
                                    "graph.image",
                                    props.flash.graph_id
                                )}
                                download
                            >
                                Download &darr;
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <footer className="col-span-2 border-t-2 border-black/10 border-dashed pt-3">
                <p className="text-sm text-black/40 font-medium">
                    Built by{" "}
                    <a href="https://ben.page" className="underline">
                        Ben Borgers
                    </a>
                    .
                </p>
            </footer>
        </div>
    );
}

import { useState } from "react";
import Button from "@/Components/Button";
import Input from "@/Components/Input";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";

export default function (props: PageProps) {
    const { post, data, setData, errors, processing } = useForm<{
        equations: {
            value: string;
            initialCondition: string;
        }[];
        timeMax: string;
    }>({
        equations: [
            {
                value: "y * (y-1)(1-y/10) - 0.1t",
                initialCondition: "10",
            },
        ],
        timeMax: "150",
    });

    return (
        <div className="p-4 sm:p-8 sm:pb-4 grid min-h-screen grid-rows-[max-content,1fr,max-content] grid-cols-[1fr,1fr]">
            <div className="col-span-2">
                <h1 className="text-2xl font-bold text-gray-900">
                    Differential Equation Grapher
                </h1>
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route("graph.execute"), {
                        preserveScroll: true,
                        preserveState: true,
                    });
                }}
                className="border-r-2 border-black/10 border-dashed mr-10 pr-10"
            >
                <div className="mt-8 space-y-4">
                    {data.equations.map((equation, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-[1fr,135px,max-content] gap-x-2 items-start"
                        >
                            <Input
                                label="Differential equation"
                                type="text"
                                value={equation.value}
                                onChange={(e) => {
                                    const equations = [...data.equations];
                                    equations[i].value =
                                        e.target.value.toLowerCase();
                                    setData("equations", equations);
                                }}
                                // @ts-expect-error
                                error={errors[`equations.${i}.value`]}
                            />

                            <Input
                                label="Initial condition"
                                type="number"
                                value={equation.initialCondition}
                                onChange={(e) => {
                                    const equations = [...data.equations];
                                    equations[i].initialCondition =
                                        e.target.value;
                                    setData("equations", equations);
                                }}
                                error={
                                    // @ts-expect-error
                                    errors[`equations.${i}.initialCondition`]
                                }
                            />

                            <Button
                                onClick={() => {
                                    const equations = [...data.equations];
                                    equations.splice(i, 1);
                                    setData("equations", equations);
                                }}
                                className="mt-[24px] h-[43px] px-4"
                            >
                                &times; Remove
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 ml-4">
                    <Button
                        onClick={() => {
                            const equations = [...data.equations];
                            equations.push({
                                value: "",
                                initialCondition: "1",
                            });
                            setData("equations", equations);
                        }}
                    >
                        + Add equation ⤴
                    </Button>
                </div>

                <div className="mt-4 flex items-center gap-x-2 border-2 border-black p-4">
                    <p className="font-medium">
                        Graph from <em>t = 0</em> to <em>t = </em>
                    </p>
                    <div className="w-28">
                        <Input
                            type="number"
                            value={data.timeMax}
                            onChange={(e) => {
                                setData("timeMax", e.target.value);
                            }}
                            error={errors.timeMax}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <Button type="submit" color="emphasis">
                        GRAPH &rarr;
                    </Button>
                </div>
            </form>

            <div className="min-w-0">
                {processing && (
                    <div className="border-2 border-black bg-white/20 w-full aspect-[1.33/1] animate-pulse"></div>
                )}

                {props.flash.graph_id && !processing && (
                    <div>
                        <img
                            src={route("graph.image", props.flash.graph_id)}
                            className="border-2 border-black aspect-[1.33/1] object-cover"
                        />
                        <div className="mt-4">
                            <Button
                                as="a"
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

                {props.flash.error && !processing && (
                    <Error message={props.flash.error} data={data} />
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

const Error = ({ message, data }: { message: string; data: object }) => {
    const lines = message.split("\n");
    const relevantStart = lines.findLastIndex((line) =>
        line.includes("return")
    );

    return (
        <div className="p-4 bg-white border-2 border-black">
            <h2 className="text-xl font-semibold">Error in your equation:</h2>

            <pre className="mt-2 whitespace-pre-wrap overflow-x-scroll bg-gray-100 p-3">
                {lines
                    .slice(relevantStart === -1 ? 0 : relevantStart)
                    .join("\n")}
            </pre>

            <div className="mt-6">
                <Help
                    message={`
Data:
${JSON.stringify(data, null, 2)}

Error:
${message}`.trim()}
                />
            </div>
        </div>
    );
};

const Help = ({ message }: { message: string }) => {
    const [askForEmail, setAskForEmail] = useState(false);
    const { data, setData, post, errors } = useForm<{
        email: string;
        message: string;
    }>({
        email: "",
        message,
    });

    if (!askForEmail) {
        return (
            <Button onClick={() => setAskForEmail(true)}>
                No idea what’s wrong, ask for help &rarr;
            </Button>
        );
    }

    return (
        <div>
            <div className="text-sm text-black space-y-0.5  bg-gray-100 p-3">
                <p>
                    Leave your email and I’ll take a look! (Either it’s your
                    fault and I’ll let you know how to fix it, or it’s my fault
                    and I’ll fix it. Both are very helpful! I will be very
                    grateful either way!)
                </p>
                <p className="italic">— Ben (Tufts ’25)</p>
            </div>
            <form
                className="mt-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    post(route("contact"), {
                        onSuccess: () => alert("I’ll get back to you asap!"),
                    });
                }}
            >
                <Input
                    label="What’s your email?"
                    type="email"
                    required
                    placeholder="you@tufts.edu"
                    value={data.email}
                    error={errors.email}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <div className="mt-3 flex justify-end">
                    <Button type="submit">Send report</Button>
                </div>
            </form>
        </div>
    );
};

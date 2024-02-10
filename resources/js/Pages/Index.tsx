import Button from "@/Components/Button";
import Error from "@/Components/Error";
import Input from "@/Components/Input";
import Layout from "@/Components/Layout";
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
    <Layout
      left={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post(route("graph.execute"), {
              preserveScroll: true,
              preserveState: true,
            });
          }}
        >
          <div className="space-y-4">
            {data.equations.map((equation, i) => (
              <div
                key={i}
                className="grid sm:grid-cols-[1fr,135px,max-content] gap-x-2 gap-y-2"
              >
                <Input
                  label="Equation"
                  pre="dy/dt ="
                  value={equation.value}
                  onChange={(e) => {
                    const equations = [...data.equations];
                    equations[i].value = e.target.value.toLowerCase();
                    setData("equations", equations);
                  }}
                  // @ts-expect-error
                  error={errors[`equations.${i}.value`]}
                  // Focus newly added equations.
                  autoFocus={i === data.equations.length - 1 && i !== 0}
                />

                <Input
                  label="Initial condition"
                  pre="y(0) ="
                  type="number"
                  step="any"
                  value={equation.initialCondition}
                  onChange={(e) => {
                    const equations = [...data.equations];
                    equations[i].initialCondition = e.target.value;
                    setData("equations", equations);
                  }}
                  error={
                    // @ts-expect-error
                    errors[`equations.${i}.initialCondition`]
                  }
                />

                <div className="flex justify-end">
                  <Button
                    onClick={() => {
                      const equations = [...data.equations];
                      equations.splice(i, 1);
                      setData("equations", equations);
                    }}
                    className="sm:mt-[24px] h-[43px] sm:px-1.5"
                  >
                    &times; <span className="sm:hidden">Remove</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 sm:ml-4">
            <Button
              onClick={() => {
                const equations = [...data.equations];
                equations.push({
                  value: "",
                  initialCondition: "",
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
                step="any"
                value={data.timeMax}
                onChange={(e) => {
                  setData("timeMax", e.target.value);
                }}
                error={errors.timeMax}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between">
            <Button type="submit" color="emphasis">
              GRAPH &rarr;
            </Button>

            <Button
              onClick={() => {
                props.flash.graph_id = undefined;
                setData({
                  equations: [{ value: "", initialCondition: "" }],
                  timeMax: "",
                });
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      }
      right={
        <div>
          {processing && (
            <div className="border-2 border-black bg-white/20 w-full aspect-[1.33/1] animate-pulse"></div>
          )}

          {props.flash.graph_id && !processing && (
            <div>
              <img
                src={route("graph.image", props.flash.graph_id)}
                className="border-2 border-black aspect-[1.33/1] object-cover w-full"
              />
              <div className="mt-4">
                <Button
                  as="a"
                  href={route("graph.image", props.flash.graph_id)}
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
      }
    ></Layout>
  );
}

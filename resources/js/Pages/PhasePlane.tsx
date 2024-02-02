import Button from "@/Components/Button";
import Error from "@/Components/Error";
import Input from "@/Components/Input";
import Layout from "@/Components/Layout";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";

export default function (props: PageProps) {
  const { data, setData, post, errors, processing } = useForm<{
    equation1: string;
    equation2: string;
    xMin: string;
    xMax: string;
    yMin: string;
    yMax: string;
  }>({
    equation1: "sin(t) - xy",
    equation2: "cos(t) - xy",
    xMin: "-3",
    xMax: "3",
    yMin: "-3",
    yMax: "3",
  });

  return (
    <Layout
      left={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post(route("phase-plane.execute"), {
              preserveScroll: true,
              preserveState: true,
            });
          }}
          className="space-y-4"
        >
          <Input
            label="Equation 1"
            pre="dx/dt ="
            value={data.equation1}
            onChange={(e) => setData("equation1", e.target.value.toLowerCase())}
            error={errors.equation1}
            autoFocus
          />

          <Input
            label="Equation 2"
            pre="dy/dt ="
            value={data.equation2}
            onChange={(e) => setData("equation2", e.target.value.toLowerCase())}
            error={errors.equation2}
          />

          <div className="space-y-2 w-max mx-auto">
            <div className="w-20 mx-auto">
              <Input
                label="Max Y"
                type="number"
                value={data.yMax}
                onChange={(e) => setData("yMax", e.target.value)}
                error={errors.yMax}
              />
            </div>
            <div className="flex gap-x-4">
              <div className="w-20">
                <Input
                  label="Min X"
                  type="number"
                  value={data.xMin}
                  onChange={(e) => setData("xMin", e.target.value)}
                  error={errors.xMin}
                />
              </div>
              <div className="w-20">
                <Input
                  label="Max X"
                  type="number"
                  value={data.xMax}
                  onChange={(e) => setData("xMax", e.target.value)}
                  error={errors.xMax}
                  className="w-20"
                />
              </div>
            </div>
            <div className="w-20 mx-auto">
              <Input
                label="Min Y"
                type="number"
                value={data.yMin}
                onChange={(e) => setData("yMin", e.target.value)}
                error={errors.yMin}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <Button type="submit" color="emphasis">
              GRAPH &rarr;
            </Button>

            <Button
              onClick={() => {
                setData({
                  equation1: "",
                  equation2: "",
                  xMin: "",
                  xMax: "",
                  yMin: "",
                  yMax: "",
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
    />
  );
}

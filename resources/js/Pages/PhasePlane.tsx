import Button from "@/Components/Button";
import Error from "@/Components/Error";
import Input from "@/Components/Input";
import Layout from "@/Components/Layout";
import { PageProps } from "@/types";
import { useForm } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

type Point = [number, number];

type FormData = {
  equation1: string;
  equation2: string;
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
  points: Point[];
};

export default function (props: PageProps) {
  const { data, setData, post, errors, processing } = useForm<FormData>({
    equation1: "(1-y) * x",
    equation2: "(1-x) * y",
    xMin: "0",
    xMax: "2",
    yMin: "0",
    yMax: "2",
    points: [],
  });

  const generateGraph = () => {
    post(route("phase-plane.execute"), {
      preserveScroll: true,
      preserveState: true,
    });
  };

  return (
    <Layout
      left={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateGraph();
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
                  points: [],
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
          {processing && !props.flash.graph_id && (
            <div className="border-2 border-black bg-white/20 w-full aspect-[1.33/1] animate-pulse"></div>
          )}

          {props.flash.graph_id && (
            <div
              className={twMerge(processing && "opacity-50 transition-opacity")}
            >
              <Image
                graphId={props.flash.graph_id}
                data={data}
                processing={processing}
                onAddPoint={(point: Point) => {
                  const _data = { ...data };
                  _data.points.push(point);
                  setData(_data);
                  generateGraph();
                }}
              />
              <p className="mt-2 italic text-sm">
                Click anywhere to draw the solution starting at that point.
                Click the point again to remove it.
              </p>
              <div className="mt-3">
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

const Image = ({
  graphId,
  data,
  onAddPoint,
  processing,
}: {
  graphId: string;
  data: FormData;
  onAddPoint: (point: Point) => void;
  processing: boolean;
}) => {
  return (
    <div
      onPointerDown={(e) => {
        if (processing) return;

        const target = e.target as HTMLDivElement;

        const rect = target.getBoundingClientRect();

        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const LEFT_EMPTY = 0.126;
        const RIGHT_EMPTY = 0.1;
        const leftEmptyPx = rect.width * LEFT_EMPTY;
        const rightEmptyPx = rect.width * RIGHT_EMPTY;
        const graphWidth = rect.width - leftEmptyPx - rightEmptyPx;
        const graphClickX = clickX - leftEmptyPx;
        const graphClickXProportion = graphClickX / graphWidth;

        const TOP_EMPTY = 0.12;
        const BOTTOM_EMPTY = 0.11;
        const topEmptyPx = rect.height * TOP_EMPTY;
        const bottomEmptyPx = rect.height * BOTTOM_EMPTY;
        const graphHeight = rect.height - topEmptyPx - bottomEmptyPx;
        const graphClickY = clickY - topEmptyPx;
        const graphClickYProportion = graphClickY / graphHeight;

        if (graphClickXProportion < 0 || graphClickXProportion > 1) return;
        if (graphClickYProportion < 0 || graphClickYProportion > 1) return;

        const coordinateX =
          (parseFloat(data.xMax) - parseFloat(data.xMin)) *
            graphClickXProportion +
          parseFloat(data.xMin);
        const coordinateY =
          (parseFloat(data.yMax) - parseFloat(data.yMin)) *
            (1 - graphClickYProportion) +
          parseFloat(data.yMin);

        onAddPoint([coordinateX, coordinateY]);
      }}
      className={twMerge(processing ? "cursor-wait" : "cursor-crosshair")}
    >
      <img
        src={route("graph.image", graphId)}
        className="border-2 border-black aspect-[1.33/1] object-cover w-full"
      />
    </div>
  );
};

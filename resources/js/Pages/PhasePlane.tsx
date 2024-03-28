import Button from "@/Components/Button";
import Error from "@/Components/Error";
import Input from "@/Components/Input";
import Layout from "@/Components/Layout";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Point = [number, number];

type FormData = {
  equation1: string;
  equation2: string;
  xMin: string;
  xMax: string;
  yMin: string;
  yMax: string;
  tMax: string;
  points: Point[];
};

export default function (props: PageProps) {
  const [data, _setData] = useState<FormData>({
    equation1: "(1-y) * x",
    equation2: "(1-x) * y",
    xMin: "0",
    xMax: "2",
    yMin: "0",
    yMax: "2",
    tMax: "50",
    points: [],
  });
  const setData = (first: keyof FormData | FormData, second?: any) => {
    if (typeof first === "string") {
      _setData((prev) => ({ ...prev, [first]: second }));
      return;
    }

    if (typeof first === "object") {
      _setData(first);
      return;
    }

    throw "Unhandled case in setData";
  };
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );

  const generateGraph = (explicitData?: FormData) => {
    router.visit(route("phase-plane.execute"), {
      method: "post",
      data: explicitData ?? data,
      preserveScroll: true,
      preserveState: true,
      onBefore: () => setProcessing(true),
      onFinish: () => setProcessing(false),
      onError: (err) => setErrors(err),
      onSuccess: () => setErrors({}),
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

          {/* Little inputs */}
          <div className="flex items-center justify-around">
            <div className="space-y-2 w-max">
              <div className="w-20 mx-auto">
                <Input
                  label="Max y"
                  type="number"
                  value={data.yMax}
                  onChange={(e) => setData("yMax", e.target.value)}
                  error={errors.yMax}
                />
              </div>
              <div className="flex gap-x-4">
                <div className="w-20">
                  <Input
                    label="Min x"
                    type="number"
                    value={data.xMin}
                    onChange={(e) => setData("xMin", e.target.value)}
                    error={errors.xMin}
                  />
                </div>
                <div className="w-20">
                  <Input
                    label="Max x"
                    type="number"
                    value={data.xMax}
                    onChange={(e) => setData("xMax", e.target.value)}
                    error={errors.xMax}
                  />
                </div>
              </div>
              <div className="w-20 mx-auto">
                <Input
                  label="Min y"
                  type="number"
                  value={data.yMin}
                  onChange={(e) => setData("yMin", e.target.value)}
                  error={errors.yMin}
                />
              </div>
            </div>
            <div className="w-20">
              <Input
                label="Max t"
                type="number"
                value={data.tMax}
                onChange={(e) => setData("tMax", e.target.value)}
                error={errors.tMax}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between items-start">
            <Button type="submit" color="emphasis">
              GRAPH &rarr;
            </Button>

            <Button
              onClick={() => {
                props.flash.graph_id = undefined;
                setData({
                  equation1: "",
                  equation2: "",
                  xMin: "0",
                  xMax: "2",
                  yMin: "0",
                  yMax: "2",
                  tMax: "50",
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
            <div className="border-2 border-black bg-white/20 w-full aspect-[4/3] animate-pulse"></div>
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
                onRemovePoint={(point: Point) => {
                  const _data = { ...data };
                  _data.points = _data.points.filter(
                    (p) => p[0] !== point[0] && p[1] !== point[1],
                  );
                  setData(_data);
                  generateGraph(_data);
                }}
              />
              <p className="mt-2 italic text-sm">
                Click anywhere to draw the solution starting at that point.
                Click the point again to remove it.
              </p>
              <div className="mt-3 flex gap-x-3">
                <Button
                  as="a"
                  href={route("graph.image", props.flash.graph_id)}
                  download
                >
                  Download &darr;
                </Button>

                {data.points.length > 0 && (
                  <Button
                    onClick={() => {
                      const _data = { ...data, points: [] };
                      setData(_data);
                      generateGraph(_data);
                    }}
                  >
                    Clear Points
                  </Button>
                )}
              </div>

              <div className="mt-12">
                <div>
                  <img
                    src={route("graph.image", `${props.flash.graph_id}_1`)}
                    className="mt-12 border-2 border-black aspect-[5/2] object-cover w-full"
                  />
                  <Button
                    as="a"
                    href={route("graph.image", `${props.flash.graph_id}_1`)}
                    download
                    className="mt-4"
                  >
                    Download &darr;
                  </Button>
                </div>
                <div className="mt-8">
                  <img
                    src={route("graph.image", `${props.flash.graph_id}_2`)}
                    className="mt-12 border-2 border-black aspect-[5/2] object-cover w-full"
                  />
                  <Button
                    as="a"
                    href={route("graph.image", `${props.flash.graph_id}_2`)}
                    download
                    className="mt-4"
                  >
                    Download &darr;
                  </Button>
                </div>
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

const GRAPH_EMPTY_PROPORTION = {
  LEFT: 0.126,
  RIGHT: 0.1,
  TOP: 0.122,
  BOTTOM: 0.111,
};

const Image = ({
  graphId,
  data,
  processing,
  onAddPoint,
  onRemovePoint,
}: {
  graphId: string;
  data: FormData;
  processing: boolean;
  onAddPoint: (point: Point) => void;
  onRemovePoint: (point: Point) => void;
}) => {
  return (
    <div className="relative">
      <img
        src={route("graph.image", graphId)}
        className="border-2 border-black aspect-[1.33/1] object-cover w-full"
      />

      <div
        className={twMerge(
          "absolute",
          processing ? "cursor-wait" : "cursor-crosshair",
        )}
        style={{
          top: GRAPH_EMPTY_PROPORTION.TOP * 100 + "%",
          bottom: GRAPH_EMPTY_PROPORTION.BOTTOM * 100 + "%",
          left: GRAPH_EMPTY_PROPORTION.LEFT * 100 + "%",
          right: GRAPH_EMPTY_PROPORTION.RIGHT * 100 + "%",
        }}
        onPointerDown={(e) => {
          if (processing) return;

          const target = e.target as HTMLDivElement;

          const rect = target.getBoundingClientRect();

          const clickX = e.clientX - rect.left;
          const clickY = e.clientY - rect.top;

          const graphClickXProportion = clickX / rect.width;
          const graphClickYProportion = clickY / rect.height;

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
      >
        {data.points.map(([x, y]) => {
          const xMin = parseFloat(data.xMin);
          const xMax = parseFloat(data.xMax);
          const yMin = parseFloat(data.yMin);
          const yMax = parseFloat(data.yMax);

          // Formula: Distance from left (min) divided by total width.
          const left = ((x - xMin) / (xMax - xMin)) * 100 + "%";
          // 1- because the y axis is inverted in CSS.
          const top = (1 - (y - yMin) / (yMax - yMin)) * 100 + "%";

          return (
            <button
              className={twMerge(
                "absolute h-4 w-4 bg-red-500 rounded-full -translate-y-2 -translate-x-2 opacity-0 duration-100 z-10",
                // Prevents red dot on hover right after adding a point.
                !processing && "hover:opacity-100",
              )}
              style={{ top, left }}
              key={`${x},${y}`}
              type="button"
              onPointerDown={(e) => {
                if (processing) return;
                e.stopPropagation();
                onRemovePoint([x, y]);
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

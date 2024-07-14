import { Ref, RefObject, forwardRef, useEffect } from "react";

const GRAPH_NATIVE_WIDTH = 480;

export default forwardRef(function Graph(_, ref: Ref<HTMLDivElement>) {
  ref = ref as RefObject<HTMLDivElement>;

  useEffect(() => {
    if (!ref?.current) {
      return;
    }

    const availableWidth = ref.current.clientWidth;
    if (availableWidth) {
      const scaleFactor = availableWidth / GRAPH_NATIVE_WIDTH;
      const graphContainer = ref.current.querySelector("div");
      console.log({ graphContainer });
      if (graphContainer) {
        graphContainer.style.transform = `scale(${scaleFactor})`;
      }
    }
  }, [ref]);

  return (
    <div
      ref={ref}
      className="[&>div>div:first-child]:hidden overflow-hidden relative"
    />
  );
});

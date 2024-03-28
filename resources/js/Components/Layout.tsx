import { Link } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";

const Layout = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  return (
    <div className="p-4 lg:p-8 lg:pb-4 lg:grid lg:h-screen lg:overflow-hidden lg:grid-rows-[max-content,1fr,max-content] lg:grid-cols-[450px,1fr] lg:grid-cols-[550px,1fr]">
      <div className="col-span-2 flex flex-col sm:flex-row justify-between sm:items-center gap-y-1 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Differential Equation Grapher
        </h1>
        <div>
          <ModeSwitcher />
        </div>
      </div>

      <div className="min-w-0 pt-4 lg:border-r-2 lg:border-black/10 lg:border-dashed lg:pr-10">
        {left}
      </div>

      <div className="min-w-0 pt-16 lg:pt-0 lg:pl-10 lg:overflow-scroll pb-8 no-scrollbar">
        {right}
      </div>

      <footer className="mt-12 lg:mt-0 col-span-2 border-t-2 border-black/10 border-dashed pt-3">
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
};

const ModeSwitcher = () => {
  const isPhasePlane = route().current("phase-plane");
  const href = isPhasePlane ? route("index") : route("phase-plane");

  return (
    <Link href={href} className="flex items-center gap-x-2">
      <p className="text-sm font-medium">1D</p>
      <div className="relative p-0.5 border-[1.5px] border-black rounded-full w-7 bg-white">
        <div
          className={twMerge(
            "h-2.5 w-2.5 bg-red-500 rounded-full",
            isPhasePlane && "translate-x-[0.68rem]",
          )}
        />
      </div>
      <p className="text-sm font-medium">2D</p>
    </Link>
  );
};

export default Layout;

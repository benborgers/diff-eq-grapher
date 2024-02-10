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
    <div className="p-4 md:p-8 md:pb-4 md:grid md:min-h-screen md:grid-rows-[max-content,1fr,max-content] md:grid-cols-[450px,1fr] lg:grid-cols-[550px,1fr]">
      <div className="col-span-2 flex flex-col sm:flex-row justify-between sm:items-center gap-y-1 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Differential Equation Grapher
        </h1>
        <div>
          <ModeSwitcher />
        </div>
      </div>

      <div className="min-w-0 pt-4 md:border-r-2 md:border-black/10 md:border-dashed md:pr-10">
        {left}
      </div>

      <div className="min-w-0 pt-16 md:pt-0 md:pl-10">{right}</div>

      <footer className="mt-20 md:mt-6 col-span-2 border-t-2 border-black/10 border-dashed pt-3">
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

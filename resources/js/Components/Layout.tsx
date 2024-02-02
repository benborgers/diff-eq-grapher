const Layout = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  return (
    <div className="p-4 sm:p-8 sm:pb-4 sm:grid sm:min-h-screen sm:grid-rows-[max-content,1fr,max-content] sm:grid-cols-[625px,1fr]">
      <div className="col-span-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Differential Equation Grapher
        </h1>
      </div>

      <div className="min-w-0 pt-8 sm:border-r-2 sm:border-black/10 sm:border-dashed sm:pr-10">
        {left}
      </div>

      <div className="min-w-0 pt-16 sm:pt-0 sm:pl-10">{right}</div>

      <footer className="mt-20 sm:mt-6 col-span-2 border-t-2 border-black/10 border-dashed pt-3">
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

export default Layout;

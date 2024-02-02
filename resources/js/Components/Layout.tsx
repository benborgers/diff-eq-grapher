const Layout = ({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) => {
  return (
    <div className="p-4 md:p-8 md:pb-4 md:grid md:min-h-screen md:grid-rows-[max-content,1fr,max-content] md:grid-cols-[450px,1fr] lg:grid-cols-[550px,1fr]">
      <div className="col-span-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Differential Equation Grapher
        </h1>
      </div>

      <div className="min-w-0 pt-8 md:border-r-2 md:border-black/10 md:border-dashed md:pr-10">
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

export default Layout;

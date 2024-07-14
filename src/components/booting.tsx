export default function Booting() {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
      <div>
        <p className="text-white font-semibold text-lg">
          Booting up grapher (~10 seconds)...
        </p>
        <p className="text-white/70 font-medium">
          Subsequent changes will be instant.
        </p>
      </div>
    </div>
  );
}

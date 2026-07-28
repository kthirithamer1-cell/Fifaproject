import Link from "next/link";

export default function NotFound() {
  return (
    <div
      suppressHydrationWarning
      className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white px-4 text-center"
    >
      <h1 className="text-6xl font-extrabold text-amber-500 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-slate-400 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/20"
      >
        Back to Home
      </Link>
    </div>
  );
}

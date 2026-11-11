import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060c14] text-white px-6">
      <div className="text-center glass-strong p-10 sm:p-14 rounded-3xl border border-white/10 max-w-md shadow-2xl">
        <h1 className="font-display text-7xl text-ember-500 text-glow mb-3">404</h1>
        <h2 className="font-display text-2xl uppercase tracking-wider text-white mb-3">Page Not Found</h2>
        <p className="text-white/60 text-sm mb-8">
          The requested coordinate does not exist in this portfolio.
        </p>
        <Link
          to="/"
          className="btn-ember inline-flex items-center gap-2 px-8 py-3 text-xs font-semibold uppercase tracking-wider"
        >
          Return to Mission Control
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

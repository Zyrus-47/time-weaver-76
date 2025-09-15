import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary text-white flex items-center justify-center shadow">
          <span className="text-3xl font-bold">404</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold">Page not found</h1>
        <p className="mb-6 text-lg text-muted-foreground">Oops! We couldn’t find what you’re looking for.</p>
        <a href="/" className="inline-block bg-gradient-primary text-white px-6 py-3 rounded-lg font-medium shadow hover:opacity-95">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
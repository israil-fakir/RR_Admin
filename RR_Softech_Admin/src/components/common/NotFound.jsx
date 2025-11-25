import React from "react";
import { Link } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800 px-6">
      <div className="text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>

        {/* Description */}
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          Oops! The page you are looking for doesn’t exist or might have been moved.  
          Please check the URL or go back to your dashboard.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-black hover:bg-primary/90 shadow-md transition"
          >
            <Home className="w-4 h-4 mr-2" /> Back to Dashboard
          </Link>
          <Link
            to="/customer/services"
            className="inline-flex items-center px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Go to Services
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-sm text-gray-400">
        © {new Date().getFullYear()} RR SoftTech Admin Panel
      </div>
    </div>
  );
}

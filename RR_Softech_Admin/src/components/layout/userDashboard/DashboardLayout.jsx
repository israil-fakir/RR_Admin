import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Topbar */}
      <Topbar />

      {/* Body Section: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (below Topbar, left-aligned) */}
        <Sidebar />

        {/* Main Content */}
        <main
          className="flex-1 min-w-0 p-4 md:p-6 overflow-y-auto bg-gray-100 mt-14"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

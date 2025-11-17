import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Key, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/UserDashboard/useAuth";
import { toast } from "react-toastify";

export default function Topbar() {
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setOpenProfileMenu(false);
      }
    };

    if (openProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfileMenu]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Sucessfully");
    setOpenProfileMenu(false);
    navigate("/user/login");
  };

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3 fixed top-0 left-0 z-40">
      {/* logo */}
      <h1 className="text-2xl font-bold pl-8 lg:pl-0">
        RR <span className="text-orange-400">Softech</span>
      </h1>

      <div className="flex items-center gap-4 relative">
        {/* notification */}
        <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
          <Bell size={22} />
          <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {/* profile + dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setOpenProfileMenu((prev) => !prev)}
            className="h-9 w-9 rounded-full overflow-hidden border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              alt="Admin"
              className="h-full w-full object-cover"
            />
          </button>

          {openProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg py-1 text-sm">
              {/* View profile */}
              <button
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  // change this path if needed
                  navigate("/user/profile");
                  setOpenProfileMenu(false);
                }}
              >
                <User size={16} />
                <span>View Profile</span>
              </button>

              {/* Change password */}
              <button
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  navigate("/user/change-password");
                  setOpenProfileMenu(false);
                }}
              >
                <Key size={16} />
                <span>Change Password</span>
              </button>

              {/* Logout */}
              <button
                className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

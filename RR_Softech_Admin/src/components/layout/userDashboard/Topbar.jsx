import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Key, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/UserDashboard/useAuth";
import { fetchProfileInfo } from "../../../api/UserDashboard/profileInfo";
import ViewProfile from "../../common/ViewProfile";
import EditProfile from "../../common/EditProfile";


export default function CustomerTopbar() {
  const [openProfileMenu, setOpenProfileMenu] = useState(false);

  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const [profileData, setProfileData] = useState(null);

  const profileMenuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  /* ------------------------------
      Fetch full profile info
  ------------------------------ */
  const loadProfileData = async () => {
    try {
      const res = await fetchProfileInfo();
      setProfileData(res);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  /* ------------------------------
      Open View Profile Modal
  ------------------------------ */
  const handleOpenViewProfile = async () => {
    await loadProfileData();
    setOpenViewModal(true);
    setOpenProfileMenu(false);
  };

  /* ------------------------------
      Re-fetch after edit success
  ------------------------------ */
  const refreshAfterEdit = async () => {
    await loadProfileData();
  };

  /* ------------------------------
     Close dropdown on outside click
  ------------------------------ */
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

  /* ------------------------------
     Logout
  ------------------------------ */
  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/login");
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3 fixed top-0 left-0 z-40">
        {/* Logo */}
        <h1 className="text-2xl font-bold pl-8 lg:pl-0">
          RR <span className="text-orange-400">Softech</span>
        </h1>

        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
            <Bell size={22} />
            <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setOpenProfileMenu((prev) => !prev)}
              className="h-9 w-9 rounded-full overflow-hidden border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <img
                src="https://i.pravatar.cc/100?img=15"
                alt="Customer"
                className="h-full w-full object-cover"
              />
            </button>

            {openProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg py-1 text-sm">
                {/* View Profile */}
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                  onClick={handleOpenViewProfile}
                >
                  <User size={16} />
                  <span>View Profile</span>
                </button>

                {/* Change Password */}
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    navigate("/customer/change-password");
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

      {/* ------------------ VIEW PROFILE MODAL ------------------ */}
      <ViewProfile
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        user={profileData}
        onEdit={() => {
          setOpenViewModal(false);
          setOpenEditModal(true);
        }}
      />

      {/* ------------------ EDIT PROFILE MODAL ------------------ */}
      <EditProfile
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        user={profileData}
        onSuccess={async () => {
          await refreshAfterEdit();
          setOpenEditModal(false);
          setOpenViewModal(true);
        }}
      />
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { Bell, LogOut, Key, User, ClipboardClock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/UserDashboard/useAuth";
import { fetchProfileInfo } from "../../../api/UserDashboard/profileInfo";

import ViewProfile from "../../common/ViewProfile";
import EditProfile from "../../common/EditProfile";
import BookAvailabilityModal from "../../common/BookAvailabilityModal";

export default function Topbar() {
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAvailabilityModal, setOpenAvailabilityModal] = useState(false);


  const [profileFull, setProfileFull] = useState(null);

  const profileMenuRef = useRef(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const loadProfile = async () => {
    try {
      const res = await fetchProfileInfo();
      setProfileFull(res);
    } catch (error) {
      console.error("Profile fetch failed:", error);
    }
  };

  const handleOpenView = async () => {
    await loadProfile();
    setOpenViewModal(true);
  };

  const handleAfterEdit = async () => {
    await loadProfile();
    setOpenEditModal(false);
    setOpenViewModal(true);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setOpenProfileMenu(false);
      }
    };

    if (openProfileMenu)
      document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openProfileMenu]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <>
      {/* ------------------------------ TOPBAR UI ------------------------------ */}
      <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 md:px-6 py-3 fixed top-0 left-0 z-40">
        <h1 className="text-2xl font-bold pl-8 lg:pl-0">
          RR <span className="text-orange-400">Softech</span>
        </h1>

        <div className="flex items-center gap-4 relative">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:text-blue-600 transition">
            <Bell size={22} />
            <span className="absolute top-1 right-1 block h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* Profile */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setOpenProfileMenu((p) => !p)}
              className="h-9 w-9 rounded-full overflow-hidden border border-gray-300"
            >
              <img
                src={"https://i.pravatar.cc/100?img=12"}
                alt="User"
                className="h-full w-full object-cover"
              />
            </button>

            {/* Dropdown */}
            {openProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-lg py-1 text-sm">
                {/* View Profile */}
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    handleOpenView();
                    setOpenProfileMenu(false);
                  }}
                >
                  <User size={16} />
                  <span>View Profile</span>
                </button>
                {/* View Profile */}
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setOpenAvailabilityModal(true);
                    setOpenProfileMenu(false);
                  }}
                >
                  <ClipboardClock size={16} />
                  <span>Book Available Slot</span>
                </button>

                {/* Change Password */}
                <button
                  className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    navigate("change-password");
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

      {/* ------------------------------ VIEW PROFILE MODAL ------------------------------ */}
      <ViewProfile
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        user={profileFull}
        onEdit={() => {
          setOpenViewModal(false);
          setOpenEditModal(true);
        }}
      />

      {/* ------------------------------ EDIT PROFILE MODAL ------------------------------ */}
      <EditProfile
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        userId={profileFull?.id}
        onSuccess={handleAfterEdit}
      />

      <BookAvailabilityModal
        open={openAvailabilityModal}
        onClose={() => setOpenAvailabilityModal(false)}
        onSuccess={() => {
          setOpenAvailabilityModal(false);
        }}
      />
    </>
  );
}

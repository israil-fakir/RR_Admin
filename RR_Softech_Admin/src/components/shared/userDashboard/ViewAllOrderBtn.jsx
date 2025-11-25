import { Eye } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ViewAllOrderBtn() {
  const navigate = useNavigate();
  return (
    <div>
      <button
        onClick={() => navigate("/customer/orders")}
        className="
            group relative px-5 py-2.5 rounded-lg font-medium text-sm 
            transition-all duration-300 flex items-center gap-2 cursor-pointer
        
            bg-white text-slate-700 border border-slate-200
            hover:text-white hover:border-transparent
            hover:bg-linear-to-r hover:from-blue-600 hover:to-blue-700
        
            hover:shadow-[0_8px_20px_rgba(37,99,235,0.25)]
            hover:-translate-y-0.5 hover:scale-[1.03]
          "
      >
        <Eye
          size={18}
          strokeWidth={2.5}
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <span className=" sm:inline font-semibold">View All Orders</span>
      </button>
    </div>
  );
}

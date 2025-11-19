import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  placeholder = "name, email, or status",
  iconColor = "text-gray-400",
  borderColor = "border-gray-200",
  focusColor = "focus:ring-blue-500",
  size = "md", // sm, md, lg
  className = "",
}) => {
  const sizeClasses =
    size === "sm"
      ? "py-1 text-sm"
      : size === "lg"
      ? "py-3 text-base"
      : "py-2 text-sm"; // default md

  return (
    <div className={`relative w-full ${className}`}>
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor} w-4 h-4`} />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={`Search by ${placeholder}`}
        className={`pl-9 pr-3  ${sizeClasses} border ${borderColor} rounded-md w-full focus:outline-none focus:ring-2 ${focusColor} transition-all`}
      />
    </div>
  );
};

export default SearchBar;

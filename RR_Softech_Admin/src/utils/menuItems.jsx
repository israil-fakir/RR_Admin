import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  MessageCircle,
  CreditCard,
} from "lucide-react";

export const menuItems = [
  { name: "All Orders", icon: <LayoutDashboard size={18} />, path: "/user/orders" },
  { name: "Pending", icon: <Clock size={18} />, path: "/user/pending" },
  { name: "Awaiting Payment", icon: <CreditCard  size={18} />, path: "/user/awaiting-payment" },
  { name: "Accepted", icon: <CheckCircle size={18} />, path: "/user/accepted" },
  { name: "Cancelled", icon: <XCircle size={18} />, path: "/user/rejected" },
  { name: "Finished", icon: <Flag size={18} />, path: "/user/finished" },
  { name: "All Services", icon: <Flag size={18} />, path: "/user/services" },
  { name: "Free Consultancy", icon: <MessageCircle size={18} />, path: "/user/free-consultancy" },
];

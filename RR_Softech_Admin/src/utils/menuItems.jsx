import {
  LayoutDashboard,
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  MessageCircle,
  CreditCard,
  SquaresExclude,
} from "lucide-react";

export const menuItems = [
  { name: "All Orders", icon: <LayoutDashboard size={18} />, path: "/customer/orders" },
  { name: "Pending", icon: <Clock size={18} />, path: "/customer/pending" },
  { name: "Awaiting Payment", icon: <CreditCard  size={18} />, path: "/customer/awaiting-payment" },
  { name: "Accepted", icon: <CheckCircle size={18} />, path: "/customer/accepted" },
  { name: "Cancelled", icon: <XCircle size={18} />, path: "/customer/rejected" },
  { name: "Finished", icon: <Flag size={18} />, path: "/customer/finished" },
  { name: "All Services", icon: <SquaresExclude size={18} />, path: "/customer/services" },
  { name: "Free Consultancy", icon: <MessageCircle size={18} />, path: "/customer/free-consultancy" },
];

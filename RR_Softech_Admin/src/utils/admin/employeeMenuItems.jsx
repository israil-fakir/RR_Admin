import {
  LayoutDashboard,
  Briefcase,
  CreditCard,
  MessageSquare,
  HandHelping,
  Star,
  BadgeCheck,
} from "lucide-react";

export const employeeMenuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/employee/"  },
  { name: "Services", icon: <Briefcase size={18} />, path: "/employee/services" },
  { name: "Transactions", icon: <CreditCard size={18} />, path: "/employee/transactions" },
  { name: "Verification", icon: <BadgeCheck size={18}/>, path: "/employee/transactions-verify" },
  { name: "Messages", icon: <MessageSquare size={18} />, path: "/employee/messages" },
  { name: "Consultancy Requests", icon: <HandHelping  size={18}/>, path: "/employee/consultancy-services" },
  { name: "Feedback", icon: <Star size={18} />, path: "/employee/feedback" },
];

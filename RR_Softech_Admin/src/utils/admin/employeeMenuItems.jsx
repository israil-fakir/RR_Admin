import {
  LayoutDashboard,
  Users,
  Briefcase,
  CreditCard,
  BarChart3,
  MessageSquare,
  MessageCircle,
  Settings,
  Star,
} from "lucide-react";

export const employeeMenuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/employee/"  },
  { name: "Services", icon: <Briefcase size={18} />, path: "/employee/services" },
  { name: "Transactions", icon: <CreditCard size={18} />, path: "/employee/transactions" },
  { name: "Analytics", icon: <BarChart3 size={18} />, path: "/employee/analytics" },
  { name: "Messages", icon: <MessageSquare size={18} />, path: "/employee/messages" },
  { name: "Feedback", icon: <Star size={18} />, path: "/employee/feedback" },
];

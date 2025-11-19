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

export const adminMenuItems = [
  { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/admin"},
  { name: "User Manage", icon: <Users size={18} />, path: "/admin/users-manage" },
  { name: "Services", icon: <Briefcase size={18} />, path: "/admin/services" },
  { name: "Transactions", icon: <CreditCard size={18} />, path: "/admin/transactions" },
  { name: "Analytics", icon: <BarChart3 size={18} />, path: "/admin/analytics" },
  { name: "Messages", icon: <MessageSquare size={18} />, path: "/admin/messages" },
  { name: "Feedback", icon: <Star size={18} />, path: "/admin/feedback" },
  { name: "Settings", icon: <Settings size={18} />, path: "/admin/settings" },
];

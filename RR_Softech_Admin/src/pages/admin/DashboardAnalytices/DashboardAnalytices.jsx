import React from "react";
import {
  Users,
  UserCheck,
  ShoppingBag,
  ClipboardList,
  Receipt,
  Clock,
  DollarSign
} from "lucide-react";

export default function DashboardAnalytics({ analytics,loading }) {
  if (!analytics) return null;

  const { user_stats, service_stats, financial_stats } = analytics;

  const items = [
    {
      label: "Total Customers",
      value: user_stats.total_customers,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      label: "Total Employees",
      value: user_stats.total_employees,
      icon: UserCheck,
      color: "bg-indigo-500/10 text-indigo-600",
    },
    {
      label: "Services Offered",
      value: service_stats.total_services_offered,
      icon: ShoppingBag,
      color: "bg-green-500/10 text-green-600",
    },
    {
      label: "Running Orders",
      value: service_stats.running_orders,
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-600",
    },
    {
      label: "Pending Quotes",
      value: service_stats.pending_quotes_for_approval,
      icon: ClipboardList,
      color: "bg-orange-500/10 text-orange-600",
    },
    {
      label: "Pending Purchase Orders",
      value: service_stats.pending_direct_purchase_orders,
      icon: Receipt,
      color: "bg-red-500/10 text-red-600",
    },
    {
      label: "Total Earnings",
      value: "$" + financial_stats.total_earnings,
      icon: DollarSign,
      color: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  if(loading) return 'Loading analytics...'

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <h2 className="text-2xl font-semibold mt-1">{item.value}</h2>
          </div>

          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${item.color}`}
          >
            <item.icon size={26} />
          </div>
        </div>
      ))}
    </div>
  );
}

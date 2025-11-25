import React, { useEffect, useState } from "react";
import { fetchProfileInfo } from "../../../api/UserDashboard/profileInfo";
import StatCard from "./StatCard";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

export default function EmployeeAnalytices() {
  const [scheduleStats, setScheduleStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await fetchProfileInfo();
      setScheduleStats(res.schedule_stats);
    } catch (err) {
      console.error("Failed to load schedule statistics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner
          variant="inline"
          size="lg"
          message="Loading Schedule Statistics..."
        />
      </div>
    );
  }

  if (!scheduleStats) {
    return (
      <div className="text-center text-red-600 py-10">Failed to load data.</div>
    );
  }

  const {
    total_schedules_handled,
    pending_requests,
    active_upcoming,
    completed_schedules,
    cancelled_schedules,
  } = scheduleStats;

  return (
    <div className="p-2 space-y-6">
      <div className="">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Schedule Statistics
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Overview of your recent schedule activity
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Total Schedules Handled"
          value={total_schedules_handled}
          desc="All schedules you managed"
          accentColor="from-indigo-500/80 to-sky-500/80"
        />

        <StatCard
          title="Pending Requests"
          value={pending_requests}
          desc="Waiting for approval"
          accentColor="from-amber-500/80 to-orange-500/80"
        />

        <StatCard
          title="Active Upcoming"
          value={active_upcoming}
          desc="Upcoming sessions"
          accentColor="from-emerald-500/80 to-teal-500/80"
        />

        <StatCard
          title="Completed Schedules"
          value={completed_schedules}
          desc="Successfully completed"
          accentColor="from-emerald-500/80 to-lime-500/80"
        />

        <StatCard
          title="Cancelled Schedules"
          value={cancelled_schedules}
          desc="Dropped or rejected"
          accentColor="from-rose-500/80 to-red-500/80"
        />
      </div>
    </div>
  );
}

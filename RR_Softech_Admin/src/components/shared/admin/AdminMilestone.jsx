import React from "react";
import { motion } from "framer-motion";
import AdminMilestoneFrom from "./AdminMilestoneFrom";
import MilestoneList from "./MilestoneList";

export default function AdminMilestone({
  setActiveTab,
  milestoneData,
  loading,
  setLoading,
  selectedMilestoneId,
  onReload
}) {
  motion
  return (
    <>
      {/* ------- CREATE / EDIT MILESTONE FORM ------- */}
      <AdminMilestoneFrom
        loading={loading}
        selectedMilestoneId={selectedMilestoneId}
        setLoading={setLoading}
        onReload={onReload} 
        autoReload={true}
           
      />

      {/* ------- MILESTONE LIST ------- */}
      <MilestoneList
        milestoneData={milestoneData}
        setActiveTab={setActiveTab}
        onReload={onReload} 
        autoReload={true}
      />
    </>
  );
}

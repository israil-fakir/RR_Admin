import React, { useEffect, useState, useMemo, useCallback } from "react";
import RightSideModal from "../UserDashboard/RightSideModal";
import { fetchOrdersById } from "../../../api/UserDashboard/orders";
import { getButtonClass } from "../../../utils/UserDashboard/services/getButtonClass";
import TransactionSection from "../../../pages/UserDashboard/Services/components/TransactionSection";
import AdminMilestone from "./AdminMilestone";
import AdminWorkUpdate from "./AdminWorkUpdate";
import { tabs } from "../../../utils/admin/tabs";
import ChatSection from "../../../pages/UserDashboard/Services/components/ChatSection";

export default function AdminModel({
  selectedOrder,
  setSelectedOrder,
  visibleTabs,
}) {
  const [ordersData, setOrdersData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ------------------ EFFECTIVE TABS ------------------ */
  const effectiveTabs = useMemo(() => {
    if (Array.isArray(visibleTabs) && visibleTabs.length > 0) {
      return tabs.filter((t) =>
        visibleTabs
          .map((v) => v.toLowerCase().trim())
          .includes(t.value.toLowerCase().trim())
      );
    }
    return tabs;
  }, [visibleTabs]);

  const [activeTab, setActiveTab] = useState(
    effectiveTabs[0]?.value ?? "Chatting"
  );

  useEffect(() => {
    setActiveTab(effectiveTabs[0]?.value ?? "Chatting");
  }, [selectedOrder, effectiveTabs]);

  const closeModal = () => {
    setSelectedOrder(null);
    setOrdersData(null);
    setLoading(true);
  };

  const loadOrderDetails = useCallback(async () => {
    if (!selectedOrder?.id) return;

    try {
      setLoading(true);
      const data = await fetchOrdersById(selectedOrder.id);
      setOrdersData(data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedOrder?.id]);

  useEffect(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  const handleReload = useCallback(() => {
    loadOrderDetails();
  }, [loadOrderDetails]);

  return (
    <RightSideModal
      isOpen={!!selectedOrder}
      onClose={closeModal}
      selectedService={selectedOrder}
    >
      {selectedOrder && (
        <div>
          {/* -------------------- TABS -------------------- */}
          <div className="flex flex-col sm:flex-row bg-blue-100 rounded-xl p-1.5 space-y-1 sm:space-y-0 sm:space-x-1">
            {effectiveTabs.map((tab) => (
              <button
                key={tab.value}
                className={getButtonClass(tab.value, activeTab)}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* -------------------- LOADING -------------------- */}
          {loading && (
            <div className="mt-6 text-gray-500 text-sm">
              Loading order details...
            </div>
          )}

          {/* -------------------- CONTENT -------------------- */}
          {!loading && ordersData && (
            <div className="mt-6">
              {activeTab === "Chatting" && (
                <ChatSection
                  chatData={ordersData.chat_messages || []}
                  loading={loading}
                  productId={ordersData.id}
                />
              )}

              {activeTab === "Transaction" && (
                <TransactionSection
                  transactionData={ordersData.transactions || []}
                  loading={loading}
                />
              )}

              {activeTab === "Milestone" && (
                <AdminMilestone
                  setActiveTab={setActiveTab}
                  milestoneData={ordersData.milestones || []}
                  loading={loading}
                  serLoading={setLoading}
                  selectedMilestoneId={ordersData?.id}
                  onReload={handleReload}
                  //autoReload={false}
                />
              )}

              {activeTab === "WorkUpdate" && (
                <AdminWorkUpdate
                  loading={loading}
                  productId={ordersData?.id}
                />
              )}
            </div>
          )}
        </div>
      )}
    </RightSideModal>
  );
}

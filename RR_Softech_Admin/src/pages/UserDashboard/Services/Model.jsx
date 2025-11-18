import React, { useEffect, useState } from "react";
import ChatSection from "./components/ChatSection";
import TransactionSection from "./components/TransactionSection";
import PaymentSection from "./components/PaymentSection";
import FeedbackSection from "./components/FeedbackSection";
import RightSideModal from "./../../../components/shared/UserDashboard/RightSideModal";
import Milestone from "./components/Milestone";
import WorkUpdate from "./components/WorkUpdate";
import { getButtonClass } from "../../../utils/UserDashboard/services/getButtonClass";
import { tabs } from "../../../utils/UserDashboard/services/tabsItems";
import ReviewList from "./components/ReviewList";
import { fetchOrdersById } from "../../../api/UserDashboard/orders";

export default function Model({
  selectedOrder,
  setSelectedOrder,
  visibleTabs,
}) {
  const [ordersData, setOrdersData] = useState(null); 
  const [loading, setLoading] = useState(true);

  
  const effectiveTabs =
    Array.isArray(visibleTabs) && visibleTabs.length
      ? tabs.filter((t) => visibleTabs.includes(t.value))
      : tabs;

          const [activeTab, setActiveTab] = useState(
    effectiveTabs[0]?.value ?? "Chatting"
  );

  const closeModal = () => {
    setSelectedOrder(null);
  };

  useEffect(() => {
    if (!selectedOrder?.id) return;

    async function loadOrderDetails() {
      try {
        setLoading(true);
        const data = await fetchOrdersById(selectedOrder.id);
        setOrdersData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrderDetails();
  }, [selectedOrder]);

  useEffect(() => {
    setActiveTab(effectiveTabs[0]?.value ?? "Chatting");
  }, [selectedOrder, visibleTabs]);

  return (
    <RightSideModal
      isOpen={!!selectedOrder}
      onClose={closeModal}
      selectedService={selectedOrder}
    >
      {selectedOrder && (
        <div>
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

          {loading && (
            <div className="mt-6 text-gray-500 text-sm">
              Loading order details...
            </div>
          )}

          {!loading && ordersData && (
            <div className="mt-6">
              {activeTab === "Chatting" && (
                <ChatSection
                  chatData={ordersData?.chat_messages || []}
                  loading={loading}
                  productId={ordersData?.id}
                />
              )}

              {activeTab === "Transaction" && (
                <TransactionSection
                  transactionData={ordersData?.transactions || []}
                  loading={loading}
                />
              )}

              {activeTab === "Payment" && <PaymentSection milestoneData={ordersData?.milestones || []} />}

              {activeTab === "Feedback" && (
                <FeedbackSection productId={ordersData?.id} />
              )}

              {activeTab === "Milestone" && (
                <Milestone
                  setActiveTab = {setActiveTab}
                  milestoneData={ordersData?.milestones || []}
                  loading={loading}
                />
              )}

              {activeTab === "WorkUpdate" && (
                <WorkUpdate
                  workUpdate={ordersData?.work_updates || []}
                  loading={loading}
                />
              )}

              {activeTab === "Reviews" && (
                <ReviewList productPlan={ordersData?.plan || null} />
              )}
            </div>
          )}
        </div>
      )}
    </RightSideModal>
  );
}

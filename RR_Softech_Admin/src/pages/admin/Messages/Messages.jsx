import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ChatBox from "../../../components/common/ChatBox";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

/**
 * Messages page for employees/admins.
 * - Sidebar (WhatsApp-like)
 * - ChatBox
 */
export default function Messages() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectConversation = ({ user, latestOrder }) => {
    setSelectedUser(user);
    setSelectedOrder(latestOrder);
  };

  return (
    <div className="relative h-[80vh] bg-gray-100">
      {/* Loading overlay (keeps page mounted) */}
      {loading && (
        <LoadingSpinner
          variant="fullscreen"
          size="lg"
          message="Loading Messages..."
        />
      )}

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="hidden md:block w-80 h-full border-r border-gray-200 bg-white">
          <Sidebar
            onSelectConversation={handleSelectConversation}
            setParentLoading={setLoading}
          />
        </div>

        {/* Chat area */}
        <div className="flex-1 p-4">
          {selectedOrder ? (
            <div className="max-w-6xl mx-auto h-full">
              <ChatBox
                currentUser="OWNER"
                orderId={selectedOrder}
                chatUser={selectedUser}
                divHeight="h-[85vh]"
                isCustomerView={false}
                setParentLoading={setLoading}
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-gray-400">
                Select a conversation to start chatting
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

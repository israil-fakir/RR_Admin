import React, { useState } from "react";
import ChatBox from "../../../components/common/ChatBox";
import Sidebar from "../../admin/Messages/Sidebar";


/**
 * Messages page for employees/admins.
 * - Sidebar (WhatsApp-like)
 * - ChatBox
 */
export default function EmployeeMassage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleSelectConversation = ({ user, latestOrder }) => {
    setSelectedUser(user);
    setSelectedOrder(latestOrder);
  };

  return (
    <div className="flex  bg-gray-100 h-[80vh]">
      <div className="hidden md:block w-80 h-[30vh]">
        <Sidebar onSelectConversation={handleSelectConversation} />
      </div>

      <div className="flex-1 p-4">
        {selectedOrder ? (
          <div className="max-w-9xl mx-auto ">
            <ChatBox
              currentUser="EMPLOYEE"
              orderId={selectedOrder}
              chatUser={selectedUser}
              divHeight="h-[85vh]"
              isCustomerView={false}
            />
          </div>
        ) : (
          <div className=" flex items-center justify-center">
            <div className="text-gray-400">Select a conversation to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}

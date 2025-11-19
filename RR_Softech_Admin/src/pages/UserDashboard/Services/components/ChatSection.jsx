import React from "react";
import ChatBox from './../../../../components/common/ChatBox';


/**
 * Customer view — only the ChatBox, no sidebar/topbar.
 *
 * Props:
 * - productId (orderId)
 * - chatData, loading (unused, you can pass if needed)
 */
export default function ChatSection({ productId }) {
  return (
    <div className="p-4">
      <div className="max-w-5xl">
        <ChatBox
          currentUser="CUSTOMER"
          orderId={productId}
          divHeight="h-[63vh]"
          isCustomerView={true}
        />
      </div>
    </div>
  );
}

import React from "react";
import ChatBox from './../../../../components/common/ChatBox';

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

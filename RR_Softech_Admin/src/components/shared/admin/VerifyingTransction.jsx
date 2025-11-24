import React, { useEffect, useState } from "react";
import {
  VerifyingPaymentStatus,
  updatePaymentStatus,
} from "../../../api/UserDashboard/payment";
import { Loader2, BadgeCheck } from "lucide-react";
import { toast } from "react-toastify";

export default function VerifyingTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  async function loadTransactions() {
    try {
      setLoading(true);
      const res = await VerifyingPaymentStatus();

      const filtered = res?.filter((t) => t.status === "VERIFYING") || [];
      setTransactions(filtered);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function handleToggleSuccess(id) {

    console.log(id);
    
    setProcessingId(id);

    try {
      await updatePaymentStatus(id, { status: "SUCCESS" });
      toast.success("Payment verified successfully!");
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment status");
    } finally {
      setProcessingId(null);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-US", {
      hour12: true,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No verifying transactions found.
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-all duration-150"
            >
              <div className="flex justify-between items-start gap-4">
                {/* LEFT SIDE INFO */}
                <div className="space-y-1 text-sm flex-1">
                  <p className="text-gray-700">
                    Customer Name:
                    <span className="ml-1 font-medium text-gray-700">
                      {t.user_name}
                    </span>
                  </p>

                  <p className="text-gray-700">
                    Provider:
                    <span className="ml-1 font-medium">{t.provider_name}</span>
                  </p>

                  <p className="text-gray-700">
                    Amount:
                    <span className="ml-1 font-medium">{t.amount} BDT</span>
                  </p>

                  <p className="text-gray-700">
                    Proof Ref:
                    <span className="ml-1 font-medium">
                      {t.proof_reference_number}
                    </span>
                  </p>

                  <p className="text-gray-400 text-xs">
                    {formatDate(t.timestamp)}
                  </p>
                </div>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex flex-col items-end gap-2">
                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium  mb-10
              ${t.status === "VERIFYING" ? "bg-yellow-100 text-yellow-700" : ""}
              ${t.status === "SUCCESS" ? "bg-green-100 text-green-700" : ""}
              ${t.status === "FAILED" ? "bg-red-100 text-red-700" : ""}
            `}
                  >
                    {t.status}
                  </span>

                  {/* VERIFY BUTTON */}
                  <button
                    onClick={() => handleToggleSuccess(t.id)}
                    disabled={processingId === t.id}
                    className="flex items-center gap-1 bg-green-600 text-white px-4 py-1.5 rounded-lg shadow hover:bg-green-700 text-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {processingId === t.id ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                    Verify
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

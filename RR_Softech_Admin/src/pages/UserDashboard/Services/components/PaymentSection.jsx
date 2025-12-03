// PaymentSection.jsx
import { useEffect, useRef, useState } from "react";
import { AdyenCheckout, Dropin } from "@adyen/adyen-web/auto";
import "@adyen/adyen-web/styles/adyen.css";
import { getSession } from "../../../../api/UserDashboard/payment";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function PaymentSection({ milestoneData = {}, milestoneId }) {
  const dropinRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropinMounted, setDropinMounted] = useState(false);
  console.log(sessionInfo);
  console.log(dropinMounted);

  // 1. Fetch session from backend using your getSession() API
  useEffect(() => {
    async function fetchSession() {
      try {
        const payload = {
          amount: {
            value: milestoneData.amount,
            currency: "USD",
          },
          reference: milestoneId,
          returnUrl: "http://localhost:5173/customer/payment-success",
          countryCode: "NL",
          provider_code: "adyen",
        };

        const session = await getSession(payload, milestoneId);
        setSessionInfo(session);
      } catch (e) {
        console.error("Failed to create Adyen session:", e);
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [milestoneData, milestoneId]);

  // 2. Initialize & mount Adyen Drop-in when sessionInfo ready
  useEffect(() => {
    if (sessionInfo && !dropinMounted && dropinRef.current) {
      (async () => {
        try {
          const checkout = await AdyenCheckout({
            clientKey: sessionInfo.clientKey,
            environment: sessionInfo.environment,
            session: {
              id: sessionInfo.id,
              sessionData: sessionInfo.sessionData,
            },
            amount: {
              value: sessionInfo.finalChargeAmount,
              currency: "USD",
            },
            locale: "nl-NL",
            countryCode: "NL",

            onPaymentCompleted: (result, component) => {
              console.log("Payment completed:", result);
              console.log("Payment component:", component);

              // handle success — e.g. redirect or update state
               window.location.href = "http://localhost:5173/customer/payment-success";
            },
            onError: (errorObj, component) => {
              console.error("Payment error:", errorObj);
              console.error("Payment component:", component);
              setError(errorObj.message || "Payment failed");
            },
          });

          new Dropin(checkout).mount(dropinRef.current);

          setDropinMounted(true);
        } catch (e) {
          console.error("AdyenCheckout init failed:", e);
          setError(e.message);
        }
      })();
    }
  }, [sessionInfo, dropinMounted]);

  // 3. Render
  if (loading) {
    return <LoadingSpinner message="Loading payment options..." />;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      <div ref={dropinRef}></div>
    </div>
  );
}

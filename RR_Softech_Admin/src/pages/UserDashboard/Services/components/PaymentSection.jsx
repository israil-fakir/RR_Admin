// PaymentSection.jsx
import { useEffect, useRef, useState } from "react";
import { AdyenCheckout, Dropin } from "@adyen/adyen-web/auto"; // Must use /auto
import "@adyen/adyen-web/styles/adyen.css";

import { getSession } from "../../../../api/UserDashboard/payment";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { toast } from "react-toastify";

export default function PaymentSection({ milestoneData = {}, milestoneId }) {
  
  const dropinRef = useRef(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const payload = {
          amount: {
            value: Number(milestoneData.amount), 
            currency: "PLN",
          },
          returnUrl: "https://comfy-frangollo-1b27cb.netlify.app/customer/payment-success",
          countryCode: "PL",
          provider_code: "adyen",
        };

        const session = await getSession(payload, milestoneId);

        setSessionInfo({
          id: session.id,
          sessionData: session.sessionData,
          clientKey: session.clientKey,
          environment: session.environment,
        });
      } catch (e) {
        console.error("Failed to create Adyen session:", e);
        setError(e.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [milestoneData, milestoneId]);

  useEffect(() => {
    if (!sessionInfo || !dropinRef.current) return;

    async function initDropin() {
      try {
        const checkout = await AdyenCheckout({
          environment: sessionInfo.environment,
          clientKey: sessionInfo.clientKey,
          session: {
            id: sessionInfo.id,
            sessionData: sessionInfo.sessionData,
          },
          amount: {
            value: Number(milestoneData.amount),
            currency: "PLN",
          },
          locale: "en-US",
          translations: { en: {} },

          countryCode: "PL",

          onPaymentCompleted: () => {
            toast.success("Payment Successful!");
            window.location.href ="https://comfy-frangollo-1b27cb.netlify.app/customer/payment-success";  
          },
          onPaymentFailed(result){
            console.log("Payment failed:", result);
            toast.error("Payment Failed. Please try again.");
          },
          onError: (error) => {
            console.error("Payment error:", error);
            setError(error.message || "Payment failed");
          },
        });
        
        const dropin = new Dropin(checkout);
        setTimeout(() => {
          if (dropinRef.current) {
            dropin.mount(dropinRef.current);
          } else {
            console.error("Drop-in root missing at mount time");
          }
        }, 0); // slight delay to ensure ref is ready
        
      } catch (e) {
        console.error("Adyen init error:", e);
        setError(e.message);
      }
    }
    
    initDropin();
  }, [sessionInfo, milestoneData.amount]);

  if (loading) return <LoadingSpinner message="Loading payment options..." />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div ref={dropinRef}></div>
    </div>
  );
}

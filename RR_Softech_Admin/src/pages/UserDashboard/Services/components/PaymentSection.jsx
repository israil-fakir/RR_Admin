import React, { useEffect, useMemo, useState } from "react";
import {
  fetchPaymentProvider,
  postIntiPayment,
  postSubmitProof,
} from "../../../../api/UserDashboard/payment";
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import ProviderSelector from "./ProviderSelector";
import ManualBankInfo from "./ManualBankInfo";
import ProofModal from "./ProofModal";
import CustomAmountInput from "./CustomAmountInput";

/**
 * PaymentSection
 *
 * - Hybrid local preview + backend confirmation
 * - When isCustom === true, Pay Now sends the custom amount to backend:
 *     initPayment(selectedProvider, Number(inputAmount))
 * - initPayment will NOT overwrite user-entered custom amount.
 */

export default function PaymentSection({ milestoneId }) {
  // Providers + selection
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Amounts
  const [inputAmount, setInputAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  // Loading, errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Init response from backend (initPayment)
  const [initResponse, setInitResponse] = useState(null);

  // Proof modal
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReference, setProofReference] = useState("");
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofsumitstate, setProofsumitstate] = useState(false);

  // Toggle between riskpay / bank UI (kept from your earlier code)
  const [toggle, setToggle] = useState("riskpay");
  const handleToggleChange = (newToggleState) => {
    setToggle(newToggleState);
  };

  // Load providers once
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchPaymentProvider();
        if (mounted) setProviders(res || []);
      } catch (err) {
        console.error("fetchPaymentProvider", err);
        toast.error("Failed to load payment providers");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Helper: initialize payment with optional custom amount
  const initPayment = async (provider, customAmount = null) => {
    if (!provider) return null;

    setLoading(true);
    setError("");
    try {
      const payload = {
        provider_code: provider.provider_name_code,
      };

      // Send custom_amount only when explicitly provided
      if (customAmount !== null) {
        // Ensure it's a string as your backend expects
        payload.custom_amount = String(customAmount);
      }

      const response = await postIntiPayment(payload, milestoneId);

      // Save backend response
      setInitResponse(response ?? null);

      // IMPORTANT: only set inputAmount from backend when we didn't send a customAmount.
      // If customAmount was provided, keep the user's inputAmount intact.
      if (customAmount === null && response?.milestone_amount !== undefined) {
        setInputAmount(String(response.milestone_amount));
      }

      return response;
    } catch (err) {
      console.error("initPayment", err);
      setError("Unable to initialize payment. Try again.");
      setInitResponse(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // when selecting a provider: select and init (no custom amount)
  const handleProviderSelect = async (provider) => {
    if (!provider) return;
    setSelectedProvider(provider);
    setIsCustom(false);
    setError("");
    setInitResponse(null);

    // Initialize to get default amounts (milestone_amount etc.)
    await initPayment(provider);
  };

  // Amount change handler (keeps it simple and safe)
  const handleAmountChange = (e) => {
    setError("");
    const val = e.target.value;

    if (val === "") {
      setInputAmount("");
      return;
    }

    // Prevent negative sign
    if (/^-/.test(val)) return;

    // Allow numbers and decimals only
    const num = Number(val);
    if (Number.isNaN(num)) return;

    setInputAmount(val);
  };

  // Pay Now (calls initPayment with custom amount if applicable)
  const handlePayNow = async () => {
    setError("");

    if (!selectedProvider) {
      setError("Please select a payment provider.");
      return;
    }

    // Validate custom amount when custom mode is on
    if (isCustom) {
      if (!inputAmount || Number(inputAmount) <= 0) {
        setError("Enter a valid custom amount.");
        return;
      }

      // optional: validate against provider min/max if available
      const min = selectedProvider?.min_amount
        ? Number(selectedProvider.min_amount)
        : null;
      const max = selectedProvider?.max_amount
        ? Number(selectedProvider.max_amount)
        : null;
      const numAmount = Number(inputAmount);

      if (min !== null && numAmount < min) {
        setError(`Amount must be at least ${min}`);
        return;
      }
      if (max !== null && numAmount > max) {
        setError(`Amount must be at most ${max}`);
        return;
      }
    }

    // Manual payment flow: show instructions rather than redirect
    if (initResponse?.payment_type === "MANUAL") {
      toast.info("Follow the bank instructions and submit your payment proof.");
      return;
    }

    setLoading(true);
    try {
      // If custom, send the custom amount to the backend, otherwise pass null
      const customAmountForApi = isCustom ? Number(inputAmount) : null;
      const res = await initPayment(selectedProvider, customAmountForApi);

      if (!res?.payment_url) {
        setError("Payment initialization failed.");
        return;
      }

      // Open payment_url
      window.open(res.payment_url, "_blank");
    } finally {
      setLoading(false);
    }
  };

  // When custom is disabled, re-init payment (so API-provided default amount is loaded)
  const handleDisableCustom = () => {
    if (selectedProvider) {
      setIsCustom(false);
      initPayment(selectedProvider);
    }
  };

  // Open proof modal
  const openProofModal = () => {
    if (!initResponse?.transaction_id) {
      setError("Initialize payment first.");
      return;
    }
    setProofReference("");
    setIsProofModalOpen(true);
  };

  // Submit proof
  const submitProof = async () => {
    setError("");
    if (!initResponse?.transaction_id) {
      setError("Missing transaction id.");
      return;
    }
    if (!proofReference || proofReference.trim().length < 3) {
      setError("Enter a valid transaction reference.");
      return;
    }

    setProofSubmitting(true);
    try {
      const payload = {
        proof_reference_number: proofReference.trim(),
      };

      const id = Number(initResponse.transaction_id);
      await postSubmitProof(payload, id);
      toast.success("Proof submitted successfully. Your transaction is under review");
      setProofsumitstate(true);
      setIsProofModalOpen(false);
    } catch (err) {
      console.error("submitProof", err);
      setError("Failed to submit proof.");
      toast.error("Failed to submit proof.");
    } finally {
      setProofSubmitting(false);
    }
  };

  const displayAmount = useMemo(() => {
    // We want a controlled string value for the input
    if (inputAmount === "") return "";
    return inputAmount;
  }, [inputAmount]);

  const isPayDisabled = () => {
    if (!selectedProvider) return true;
    if (loading) return true;
    return false;
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <ProviderSelector
            providers={providers}
            selectedProvider={selectedProvider}
            handleProviderSelect={handleProviderSelect}
            onToggle={handleToggleChange}
          />
        </div>
      </div>

      {/* Amount + custom toggle */}
      {toggle === "riskpay" && (
        <CustomAmountInput
          initResponse={initResponse}
          selectedProvider={selectedProvider}
          isCustom={isCustom}
          setIsCustom={setIsCustom}
          displayAmount={displayAmount}
          handleAmountChange={handleAmountChange}
          error={error}
          onDisableCustom={handleDisableCustom}
          onClick={handlePayNow}
          loading={loading}
          disabled={isPayDisabled()}
        />
      )}

      {/* Manual Bank Flow */}
      {initResponse?.payment_type === "MANUAL" && toggle === "bank" && (
        <>
          <ManualBankInfo data={initResponse} />

          <button
            type="button"
            onClick={openProofModal}
            disabled={!initResponse?.transaction_id || proofsumitstate === true}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                !initResponse?.transaction_id
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            <Upload className="h-4 w-4" />
            Submit Payment Proof
          </button>
        </>
      )}

      {/* Proof Modal */}
      {isProofModalOpen && (
        <ProofModal
          onClose={() => setIsProofModalOpen(false)}
          proofReference={proofReference}
          setProofReference={setProofReference}
          onSubmit={submitProof}
          submitting={proofSubmitting}
          error={error}
        />
      )}
    </div>
  );
}

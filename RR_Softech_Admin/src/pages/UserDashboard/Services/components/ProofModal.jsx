import { Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchPaymentProvider,
  postIntiPayment,
  postSubmitProof,
} from "../../../../api/UserDashboard/payment";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import CustomAmountInput from "./CustomAmountInput";
import ManualBankInfo from "./ManualBankInfo";
import ProofModal from "./ProofModal";
import ProviderSelector from "./ProviderSelector";

export default function PaymentSection({ milestoneData = {}, milestoneId }) {
  // providers loaded from API
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  // amount UI state
  const [inputAmount, setInputAmount] = useState(""); // string to keep typed value
  const [isCustom, setIsCustom] = useState(false);

  // global UI state
  const [loading, setLoading] = useState(false); // loading used for API init & Pay Now
  const [error, setError] = useState("");

  // response only after actual initPayment API call
  const [initResponse, setInitResponse] = useState(null);

  // proof modal flow
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReference, setProofReference] = useState("");
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofSubmitState, setProofSubmitState] = useState(false);

  // toggle (kept from your code)
  const [toggle, setToggle] = useState("riskpay");
  const handleToggleChange = (newToggleState) => setToggle(newToggleState);

  // load providers once
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetchPaymentProvider();
        if (!mounted) return;
        setProviders(res || []);
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

  // If milestoneData has an amount, use it as default when provider selected and not custom
  const milestoneAmount = useMemo(() => {
    const v = milestoneData?.milestone_amount ?? milestoneData?.price ?? 0;
    return Number(v) || 0;
  }, [milestoneData]);

  // When user selects a provider we must NOT call the backend.
  // We only set provider and prepare local calculation.
  const handleProviderSelect = (provider) => {
    if (!provider) return;
    setSelectedProvider(provider);
    setError("");

    // If not custom, set input amount to milestone amount (string)
    if (!isCustom) {
      setInputAmount(String(milestoneAmount));
    }
    // clear any previous init response because this selection hasn't been initialized on backend yet
    setInitResponse(null);
  };

  // validate and sanitize typed amount
  const handleAmountChange = (e) => {
    setError("");
    const val = e.target.value;
    if (val === "") {
      setInputAmount("");
      return;
    }

    // disallow negative sign or non-numeric
    if (/^-/.test(val)) return;
    const num = Number(val);
    if (Number.isNaN(num)) return;
    setInputAmount(val);
  };

  // initPayment will call backend when user actually wants to start a payment flow
  const initPayment = async (provider, customAmount = null) => {
    if (!provider) return null;
    setLoading(true);
    setError("");
    try {
      const payload = {
        provider_code: provider.provider_name_code,
      };
      if (customAmount !== null) payload.custom_amount = String(customAmount);

      const response = await postIntiPayment(payload, milestoneId);
      setInitResponse(response ?? null);

      // If backend returned milestone_amount and user wasn't using custom, sync display
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

  // Pay Now: validate then call initPayment (backend)
  const handlePayNow = async () => {
    setError("");

    if (!selectedProvider) {
      setError("Please select a payment provider.");
      return;
    }

    // compute effective amount to send to backend (null => use milestone amount server-side)
    const useCustom = isCustom;
    let amountToSend = null;
    if (useCustom) {
      if (!inputAmount || Number(inputAmount) <= 0) {
        setError("Enter a valid custom amount.");
        return;
      }

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
      amountToSend = numAmount;
    }

    setLoading(true);
    try {
      const res = await initPayment(selectedProvider, amountToSend);
      if (!res) {
        setError("Payment initialization failed.");
        return;
      }

      // If manual: just show bank instructions and ask user to submit proof
      if (res?.payment_type === "MANUAL") {
        toast.info("Follow the bank instructions and submit your payment proof.");
        // keep initResponse so ManualBankInfo can render
        return;
      }

      // For gateway, open payment_url returned by backend
      if (res?.payment_url) {
        window.open(res.payment_url, "_blank");
      } else {
        setError("Payment initialization failed (no payment url).");
      }
    } catch (err) {
      console.error("handlePayNow", err);
      setError("Payment failed to start.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableCustom = () => {
    if (selectedProvider) {
      // revert to milestone amount and recalc locally
      setIsCustom(false);
      setInputAmount(String(milestoneAmount));
      // clear previous initResponse because we didn't init on backend
      setInitResponse(null);
    }
  };

  const openProofModal = () => {
    if (!initResponse?.transaction_id) {
      setError("Initialize payment first.");
      return;
    }
    setProofReference("");
    setIsProofModalOpen(true);
  };

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
      setProofSubmitState(true);
      setIsProofModalOpen(false);
    } catch (err) {
      console.error("submitProof", err);
      setError("Failed to submit proof.");
      toast.error("Failed to submit proof.");
    } finally {
      setProofSubmitting(false);
    }
  };

  // displayAmount string shown in input: if user typed, use that; else show milestone amount when not custom
  const displayAmount = useMemo(() => {
    if (inputAmount !== "") return inputAmount;
    // if user hasn't typed anything and not custom, use milestone amount
    return String(milestoneAmount || "");
  }, [inputAmount, milestoneAmount]);

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
        <>
          <CustomAmountInput
            // inputs for local calculation
            milestoneAmount={milestoneAmount}
            selectedProvider={selectedProvider}
            isCustom={isCustom}
            setIsCustom={(v) => {
              setIsCustom(v);
              // when enabling custom, clear input so user types
              if (v) setInputAmount("");
              // when disabling, revert to milestone amount
              else setInputAmount(String(milestoneAmount));
            }}
            displayAmount={displayAmount}
            handleAmountChange={handleAmountChange}
            error={error}
            onDisableCustom={handleDisableCustom}
            onClick={handlePayNow}
            loading={loading}
            disabled={isPayDisabled()}
          />
        </>
      )}

      {/* Manual Bank Flow */}
      {initResponse?.payment_type === "MANUAL" && toggle === "bank" && (
        <>
          <ManualBankInfo data={initResponse} />

          <button
            type="button"
            onClick={openProofModal}
            disabled={!initResponse?.transaction_id || proofSubmitState === true}
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

      {loading && (
        <LoadingSpinner variant="inline" size="lg" message="Loading Payment..." />
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

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


export default function PaymentSection({ milestoneId }) {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [inputAmount, setInputAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [proloading, setProLoading] = useState(false);

  const [initResponse, setInitResponse] = useState(null);

  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReference, setProofReference] = useState("");
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofsumitstate, setProofsumitstate] = useState(false);

  const [toggle, setToggle] = useState("riskpay");
  const handleToggleChange = (newToggleState) => {
    setToggle(newToggleState);
  };

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

      if (customAmount !== null) {
        payload.custom_amount = String(customAmount);
      }

      const response = await postIntiPayment(payload, milestoneId);
      setInitResponse(response ?? null);

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

  const handleProviderSelect = async (provider) => {
    if (!provider) return;
    setSelectedProvider(provider);
    setIsCustom(false);
    setError("");
    setInitResponse(null);
    setProLoading(true);
    await initPayment(provider);
    setProLoading(false);
  };

  const handleAmountChange = (e) => {
    setError("");
    const val = e.target.value;

    if (val === "") {
      setInputAmount("");
      return;
    }

    if (/^-/.test(val)) return;

    const num = Number(val);
    if (Number.isNaN(num)) return;

    setInputAmount(val);
  };

  const handlePayNow = async () => {
    setError("");

    if (!selectedProvider) {
      setError("Please select a payment provider.");
      return;
    }

    if (isCustom) {
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
    }

    if (initResponse?.payment_type === "MANUAL") {
      toast.info("Follow the bank instructions and submit your payment proof.");
      return;
    }

    setLoading(true);
    try {
      const customAmountForApi = isCustom ? Number(inputAmount) : null;
      const res = await initPayment(selectedProvider, customAmountForApi);

      if (!res?.payment_url) {
        setError("Payment initialization failed.");
        return;
      }

      window.open(res.payment_url, "_blank");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableCustom = () => {
    if (selectedProvider) {
      setIsCustom(false);
      initPayment(selectedProvider);
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
        <>
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
          loading = {loading}
          disabled={isPayDisabled()}
        />
        {proloading && <LoadingSpinner 
        variant="inline"
        size="lg"
        message="Loading Payment..."/>}
        </>
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
      {loading && <LoadingSpinner 
        variant="inline"
        size="lg"
        message="Loading Payment..."/>}

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

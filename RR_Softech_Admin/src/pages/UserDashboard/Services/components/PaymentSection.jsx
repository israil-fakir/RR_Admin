// PaymentSection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";

import {
  fetchPaymentProvider,
  postIntiPayment,
  postSubmitProof,
} from "../../../../api/UserDashboard/payment";

import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import ProviderSelector from "./ProviderSelector";
import CustomAmountInput from "./CustomAmountInput";
import ManualBankInfo from "./ManualBankInfo";
import ProofModal from "./ProofModal";

export default function PaymentSection({ milestoneData = {}, milestoneId }) {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const [inputAmount, setInputAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const [loading, setLoading] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [error, setError] = useState("");

  const [initResponse, setInitResponse] = useState(null);

  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [proofReference, setProofReference] = useState("");
  const [proofSubmitting, setProofSubmitting] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  const [toggle, setToggle] = useState("riskpay");

  const baseMilestoneAmount = useMemo(() => {
    const amt = milestoneData?.amount ?? "0";
    const n = Number(amt);
    return Number.isFinite(n) ? n : 0;
  }, [milestoneData]);

  useEffect(() => {
    if (!isCustom) {
      setInputAmount(String(baseMilestoneAmount || ""));
    }
  }, [baseMilestoneAmount, isCustom]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setProvidersLoading(true);
      try {
        const res = await fetchPaymentProvider();
        if (mounted) setProviders(res || []);
      } catch (err) {
        console.error("fetchPaymentProvider", err);
        toast.error("Failed to load payment providers");
      } finally {
        if (mounted) setProvidersLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  const parsedAmountForCalc = useMemo(() => {
    if (inputAmount === "" || inputAmount === null) return 0;

    const n = Number(inputAmount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [inputAmount, baseMilestoneAmount]);

  const { localFee, localTotal } = useMemo(() => {
    const percent = Number(selectedProvider?.processing_fee_percentage ?? 0);
    const amt = Number(parsedAmountForCalc ?? 0);
    const fee = Number(((amt * percent) / 100).toFixed(2));
    const total = Number((amt + fee).toFixed(2));
    return { localFee: fee, localTotal: total };
  }, [selectedProvider, parsedAmountForCalc]);

  const handleProviderSelect = (provider) => {
    setError("");
    setSelectedProvider(provider);
    setInitResponse(null);
    setProofSubmitted(false);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value;

    // allow empty input
    if (val === "") {
      setInputAmount("");
      setError("");
      return;
    }

    // block negative values
    if (/^-/.test(val)) return;

    // block non-numeric values
    if (!/^\d*\.?\d*$/.test(val)) return;

    setInputAmount(val);

    // live validation
    if (selectedProvider) {
      const amt = Number(val);
      const min = Number(selectedProvider?.min_amount);
      const max = Number(selectedProvider?.max_amount);

      if (min && amt < min) {
        setError(`Amount must be at least ${min}`);
      } else if (max && amt > max) {
        setError(`Amount must be at most ${max}`);
      } else {
        setError("");
      }
    }
  };

  // ------------- 6) disable custom -> reset to milestone amount -------------
  const handleDisableCustom = () => {
    setIsCustom(false);
    setInputAmount(String(baseMilestoneAmount || ""));
    setError("");
  };

  // ------------- 7) validation helpers -------------
  const amountWithinProviderLimits = () => {
    if (!selectedProvider) return false;
    // provider min/max are strings; parse them
    const min = selectedProvider?.min_amount
      ? Number(selectedProvider.min_amount)
      : null;
    const max = selectedProvider?.max_amount
      ? Number(selectedProvider.max_amount)
      : null;
    const amt = Number(parsedAmountForCalc);
    if (!Number.isFinite(amt) || amt <= 0) return false;
    if (min !== null && amt < min) {
      setError(`Amount must be at least ${min}`);
      return false;
    }
    if (max !== null && amt > max) {
      setError(`Amount must be at most ${max}`);
      return false;
    }
    return true;
  };

  // For UI: a quick boolean if Pay Now should be disabled
  const isPayDisabled = useMemo(() => {
    if (!selectedProvider) return true;
    if (loading) return true;

    const amt = Number(parsedAmountForCalc);
    if (!amt || amt <= 0) return true;

    const min = Number(selectedProvider?.min_amount);
    const max = Number(selectedProvider?.max_amount);

    if (min && amt < min) return true;
    if (max && amt > max) return true;

    return false;
  }, [selectedProvider, loading, parsedAmountForCalc]);

  // ------------- 8) backend init (on Pay Now only) -------------
  const handlePayNow = async () => {
    setError("");
    if (!selectedProvider) {
      setError("Please select a provider.");
      return;
    }

    // Validate (this will set a short error if invalid)
    if (!amountWithinProviderLimits()) {
      // amountWithinProviderLimits already sets a short error message
      return;
    }

    setLoading(true);
    try {
      const payload = {
        provider_code: selectedProvider.provider_name_code,
      };
      // we are not using "custom amount" as a separate path here; per your confirmation,
      // milestone amount is used and validated. But if isCustom is true, we will still send it.
      if (isCustom) {
        payload.custom_amount = String(parsedAmountForCalc);
      }

      const res = await postIntiPayment(payload, milestoneId);
      if (!res) {
        setError("Payment initialization failed.");
        return;
      }

      // Store backend init response (used for MANUAL flow)
      setInitResponse(res);

      if (res.payment_type === "GATEWAY") {
        if (!res.payment_url) {
          setError("Gateway did not return payment URL.");
          return;
        }
        // open the external payment page
        window.open(res.payment_url, "_blank");
        // optionally show toast
        toast.success("Payment opened in a new tab.");
      } else if (res.payment_type === "MANUAL") {
        toast.info(
          "Follow the bank instructions and submit your payment proof."
        );
        // will show ManualBankInfo below
      } else {
        // unexpected: still store initResponse so UI can inspect
        toast.info(res.message || "Payment initialized.");
      }
    } catch (err) {
      console.error("postIntiPayment", err);
      setError("Failed to initialize payment.");
      toast.error("Failed to initialize payment.");
    } finally {
      setLoading(false);
    }
  };

  // ------------- 9) proof submission -------------
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
      const payload = { proof_reference_number: proofReference.trim() };
      const id = Number(initResponse.transaction_id);
      await postSubmitProof(payload, id);
      toast.success(
        "Proof submitted successfully. Your transaction is under review"
      );
      setProofSubmitted(true);
      setIsProofModalOpen(false);
      // After proof success we keep initResponse and disable further Pay Now attempts
    } catch (err) {
      console.error("submitProof", err);
      setError("Failed to submit proof.");
      toast.error("Failed to submit proof.");
    } finally {
      setProofSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <ProviderSelector
            providers={providers}
            loading={providersLoading}
            selectedProvider={selectedProvider}
            onSelect={handleProviderSelect}
            toggle={toggle}
            onToggle={(t) => setToggle(t)}
          />
        </div>
      </div>

      {/* Amount + breakdown (only visible for riskpay flow or any gateway type) */}
      {toggle === "riskpay" && (
        <>
          <CustomAmountInput
            baseAmount={baseMilestoneAmount}
            amount={inputAmount}
            isCustom={isCustom}
            setIsCustom={setIsCustom}
            onAmountChange={handleAmountChange}
            onDisableCustom={handleDisableCustom}
            processingPercentage={Number(
              selectedProvider?.processing_fee_percentage ?? 0
            )}
            localFee={localFee}
            localTotal={localTotal}
            providerMin={selectedProvider?.min_amount}
            providerMax={selectedProvider?.max_amount}
            error={error}
            onPayNow={handlePayNow}
            disabled={isPayDisabled || loading}
            loading={loading}
          />

          {providersLoading && (
            <LoadingSpinner
              variant="inline"
              size="lg"
              message="Loading providers..."
            />
          )}
        </>
      )}

      {/* Manual bank flow (shown after backend init returns payment_type=MANUAL and bank tab selected) */}
      {initResponse?.payment_type === "MANUAL" && toggle === "bank" && (
        <>
          <ManualBankInfo data={initResponse} />

          <button
            type="button"
            onClick={openProofModal}
            disabled={!initResponse?.transaction_id || proofSubmitted === true}
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
        <LoadingSpinner
          variant="inline"
          size="lg"
          message="Processing payment..."
        />
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

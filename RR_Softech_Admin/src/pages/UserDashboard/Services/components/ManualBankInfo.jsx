import { CreditCard } from "lucide-react";


export default function ManualBankInfo({ data = {} }) {
  const status = data.proof_submission_status ?? null;

  return (
    <div className="w-full bg-gradient-to-tr from-white to-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-md bg-blue-50">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">Bank / Manual Payment</div>
            <div className="mt-1 text-xs text-gray-600">{data.message}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Transaction</div>
          <div className="text-sm font-mono font-semibold text-gray-800">#{data.transaction_id}</div>
          <div className="mt-2">
            {status === "VERIFYING" && (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-800 border border-yellow-100">
                <svg className="h-3 w-3 animate-pulse" viewBox="0 0 8 8" fill="currentColor">
                  <circle cx="4" cy="4" r="4" />
                </svg>
                <span>VERIFYING</span>
              </div>
            )}

            {status === "SUCCESS" && (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-green-50 text-green-800 border border-green-100">
                <CheckCircle className="h-4 w-4" />
                <span>SUCCESS</span>
              </div>
            )}

            {!status && (
              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-100">
                <span>AWAITING PROOF</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-md border border-gray-100">
          <div className="text-xs text-gray-500">Bank Details</div>
          <div className="mt-2 text-sm font-medium text-gray-800 break-words">{data.bank_details}</div>
        </div>

        <div className="bg-white p-3 rounded-md border border-gray-100">
          <div className="text-xs text-gray-500">Amount</div>
          <div className="mt-2 text-sm font-medium text-gray-800">
            ${data.milestone_amount} <span className="text-xs text-gray-500">+ ${data.processing_fee} fee</span>
            <div className="mt-2 text-base font-semibold">${data.final_charge_amount}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">{data.message}</div>
    </div>
  );
}
import { Loader2, Upload, XCircle } from "lucide-react";

export default function ProofModal({ onClose, proofReference, setProofReference, onSubmit, submitting, error }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="proof-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg z-10 p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 id="proof-modal-title" className="text-lg font-semibold text-gray-800">
            Submit Payment Proof
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XCircle className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          Enter your transaction reference number so we can verify your manual bank transfer.
        </p>

        <div className="mt-4">
          <label className="block text-xs text-gray-600">Transaction Reference</label>
          <input
            type="text"
            value={proofReference}
            onChange={(e) => setProofReference(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. 11dfadfs56451asdf"
          />
        </div>

        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

        <div className="mt-5 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-md text-sm bg-gray-100">
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={submitting}
            className={`px-4 py-2 rounded-md text-sm text-white ${
              submitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>Submit Proof</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
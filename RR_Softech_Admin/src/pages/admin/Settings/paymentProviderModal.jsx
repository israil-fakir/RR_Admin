import React, { useEffect, useState } from "react";

function TextField({ label, name, type = "text", required = false, ...props }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>
            <input
                name={name}
                type={type}
                required={required}
                {...props}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
        </label>
    );
}

function SelectField({ label, name, options = [], required = false, ...props }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>

            <select
                name={name}
                required={required}
                {...props}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none 
                           focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
                <option value="">Select {label.toLowerCase()}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}


function TextAreaField({ label, name, required = false, ...props }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>
            <textarea
                name={name}
                required={required}
                {...props}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
        </label>
    );
}

function SwitchField({ label, checked, onChange }) {
    return (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className="flex items-center gap-2 text-sm"
        >
            <span className="font-medium text-slate-700">{label}</span>
            <span
                className={`inline-flex h-5 w-9 items-center rounded-full transition ${checked ? "bg-indigo-600" : "bg-slate-300"
                    }`}
            >
                <span
                    className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "translate-x-4" : "translate-x-1"
                        }`}
                />
            </span>
        </button>
    );
}

export default function PaymentProviderModal({
    type,
    open,
    onClose,
    data,
    onSave,
    loading,
}) {
    const [form, setForm] = useState(data || {});
    const isManual = type === "manual";
    const titleText = isManual
        ? "Manual or Banking Payment"
        : "Riskpay Payment Provider";

    useEffect(() => {
        setForm(data || {});
    }, [data, open]);

    if (!open || !type) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleActive = (value) => {
        setForm((prev) => ({ ...prev, is_active: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(type, form);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-xs bg-slate-900/40 p-4">
            <div className="flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-300 px-5 py-3">
                    <h3 className="text-lg font-semibold text-slate-900">{titleText}</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                        <span className="sr-only">Close</span>×
                    </button>
                </div>

                {/* Scrollable body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col overflow-y-auto no-scrollbar"
                >
                    <div className="space-y-4 px-5 py-4">
                        {/* Title + Provider code */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField
                                label="Title"
                                name="title"
                                value={form.title || ""}
                                onChange={handleChange}
                                required
                                placeholder={isManual ? "Manual or Banking" : "Riskpay"}
                            />
                            <TextField
                                label="Provider code"
                                name="provider_name_code"
                                value={form.provider_name_code || ""}
                                onChange={handleChange}
                                required
                                placeholder={isManual ? "bank" : "riskpay"}
                            />
                        </div>


                        {/* Logo + account number (manual only) */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <label className="block text-sm">
                                <span className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                                    Logo (image file)
                                    <span className="text-red-500">*</span>
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required={!form.id} // required on create; optional on edit
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setForm((prev) => ({ ...prev, logo: file }));
                                    }}
                                    className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
                                />
                            </label>

                            {isManual && (
                                <TextField
                                    label="Account number"
                                    name="account_number"
                                    value={form.account_number || ""}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. 1738992592394"
                                />
                            )}

                        </div>

                        {/* Description */}
                        <TextAreaField
                            label="Description"
                            name="description"
                            rows={2}
                            value={form.description || ""}
                            onChange={handleChange}
                        />

                        {/* Bank details only for manual */}
                        {isManual && (
                            <TextAreaField
                                label="Bank details (for manual / banking)"
                                name="bank_details"
                                rows={3}
                                value={form.bank_details || ""}
                                onChange={handleChange}
                            />
                        )}

                        {/* Fee + min/max amounts */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <TextField
                                label="Processing fee percentage"
                                name="processing_fee_percentage"
                                type="number"
                                step="0.01"
                                value={form.processing_fee_percentage || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 0.50"
                            />
                            <TextField
                                label="Minimum amount"
                                name="min_amount"
                                type="number"
                                step="0.01"
                                value={form.min_amount || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 1000"
                            />
                            <TextField
                                label="Maximum amount"
                                name="max_amount"
                                type="number"
                                step="0.01"
                                value={form.max_amount || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 500000"
                            />
                        </div>


                        {/* Type + active toggle */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <SelectField
                                label="Type"
                                name="type"
                                value={form.type || ""}
                                onChange={handleChange}
                                required
                                options={
                                    isManual
                                        ? [
                                            { value: "BANK_TRANSFER", label: "Bank Transfer" },
                                        ]
                                        : [
                                            { value: "CRYPTO", label: "Crypto" },
                                        ]
                                }
                            />


                            <div className="mt-4 md:mt-6">
                                <SwitchField
                                    label="Is active"
                                    checked={form.is_active ?? true}
                                    onChange={handleToggleActive}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer (non-scrolling) */}
                    <div className="flex justify-end gap-3 border-t border-slate-300 px-5 py-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

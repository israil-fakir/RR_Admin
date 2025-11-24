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

export default function ServiceModal({
    open,
    onClose,
    data,
    onSave,
    loading,
}) {
    const [form, setForm] = useState(
        data || { id: null, name: "", slug: "", description: "", is_product: true }
    );

    const isEdit = Boolean(form.id);
    const titleText = isEdit ? "Edit Service" : "Add New Service";

    useEffect(() => {
        setForm(
            data || { id: null, name: "", slug: "", description: "", is_product: true }
        );
    }, [data, open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleProduct = (value) => {
        setForm((prev) => ({ ...prev, is_product: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Only send the four required fields (plus id if present for edit)
        const payload = {
            id: form.id,
            name: form.name,
            slug: form.slug,
            description: form.description,
            is_product: form.is_product,
        };
        onSave(payload);
    };

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
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

                {/* Body */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-1 flex-col overflow-y-auto no-scrollbar"
                >
                    <div className="space-y-4 px-5 py-4">
                        {/* Name + Slug */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField
                                label="Service name"
                                name="name"
                                value={form.name || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. PPC Campaign Management"
                            />
                            <TextField
                                label="Slug"
                                name="slug"
                                value={form.slug || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. ppc-campaign-management"
                            />
                        </div>

                        {/* Description */}
                        <TextAreaField
                            label="Description"
                            name="description"
                            rows={3}
                            value={form.description || ""}
                            onChange={handleChange}
                            required
                            placeholder="Short description of this service..."
                        />

                        {/* Is product toggle */}
                        <div className="mt-2">
                            <SwitchField
                                label="Is product?"
                                checked={form.is_product ?? true}
                                onChange={handleToggleProduct}
                            />
                        </div>
                    </div>

                    {/* Footer */}
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
                            {loading ? "Saving..." : "Save service"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

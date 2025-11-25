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

function SelectField({ label, name, value, onChange, options, required = false }) {
    return (
        <label className="block text-sm">
            <span className="mb-1 flex items-center gap-1 font-medium text-slate-700">
                {label}
                {required && <span className="text-red-500">*</span>}
            </span>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
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

// helper to slugify plan name
const slugify = (str = "") =>
    str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export default function PlanModal({
    open,
    onClose,
    data,
    onSave,
    loading,
    services,
}) {
    const [form, setForm] = useState({
        service: "",
        name: "",
        slug: "",
        description: "",
        price: "",
        billing_cycle: "MONTHLY",
    });

    const [slugEdited, setSlugEdited] = useState(false);

    useEffect(() => {
        if (data) {
            setForm({
                service: data.service || "",
                name: data.name || "",
                slug: data.slug || "",
                description: data.description || "",
                price: data.price || "",
                billing_cycle: data.billing_cycle || "MONTHLY",
            });
        } else {
            setForm({
                service: "",
                name: "",
                slug: "",
                description: "",
                price: "",
                billing_cycle: "MONTHLY",
            });
        }
        setSlugEdited(false);
    }, [data, open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "slug") {
            setSlugEdited(true);
            setForm((prev) => ({ ...prev, slug: value }));
            return;
        }

        setForm((prev) => {
            const updated = { ...prev, [name]: value };
            if (name === "name" && !slugEdited) {
                updated.slug = slugify(value);
            }
            return updated;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form); // description is the multi-line features string
    };

    const serviceOptions = (services || []).map((s) => ({
        value: s.id,
        label: s.name,
    }));

    const billingOptions = [
        { value: "DAILY", label: "Daily" },
        { value: "WEEKLY", label: "Weekly" },
        { value: "MONTHLY", label: "Monthly" },
        { value: "YEARLY", label: "Yearly" },
    ];

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
            <div className="flex w-full max-w-xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-300 px-5 py-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {data ? "Edit Plan" : "Create Plan"}
                    </h3>
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
                        {/* Service */}
                        <SelectField
                            label="Service"
                            name="service"
                            value={form.service || ""}
                            onChange={handleChange}
                            options={serviceOptions}
                            required
                        />

                        {/* Name & slug */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField
                                label="Plan name"
                                name="name"
                                value={form.name || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Lite, Pro, Growth Plus"
                            />
                            <TextField
                                label="Slug"
                                name="slug"
                                value={form.slug || ""}
                                onChange={handleChange}
                                required
                                placeholder="auto-generated-from-name"
                            />
                        </div>

                        {/* Description = one feature per line */}
                        <TextAreaField
                            label="Description / Features"
                            name="description"
                            rows={6}
                            value={form.description || ""}
                            onChange={handleChange}
                            required
                            placeholder={
                                "3 Designs per month\nLogo design\nJPG, PNG formats\n3–5 days turnaround\nEmail support"
                            }
                        />
                        <p className="text-xs text-slate-500">
                            Write <span className="font-semibold">one feature per line</span>.
                            Each line will be shown with a green check icon on the plan card.
                        </p>

                        {/* Price + billing */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <TextField
                                label="Price"
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={form.price || ""}
                                onChange={handleChange}
                                required
                                placeholder="e.g. 699"
                            />

                            <SelectField
                                label="Billing cycle"
                                name="billing_cycle"
                                value={form.billing_cycle || "MONTHLY"}
                                onChange={handleChange}
                                options={billingOptions}
                                required
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
                            {loading ? "Saving..." : "Save plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

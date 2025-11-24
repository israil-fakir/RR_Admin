// src/pages/admin/Settings/SiteSettingsModal.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import {
    fetchSiteSettings,
    updateSiteSettings,
} from "../../../api/admin/siteSettings";

const defaultValues = {
    site_email: "",
    site_phone: "",
    site_location: "",
    copyright_text: "",
};

export default function SiteSettingsModal({ open, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(defaultValues);

    // Load existing settings when modal opens
    useEffect(() => {
        if (!open) return;

        setLoading(true);
        fetchSiteSettings()
            .then((res) => {
                // if backend returns a single object
                const data = res.data || {};
                setFormData({
                    site_email: data.site_email || "",
                    site_phone: data.site_phone || "",
                    site_location: data.site_location || "",
                    copyright_text: data.copyright_text || "",
                });
            })
            .catch(() => {
                toast.error("Failed to load site settings");
            })
            .finally(() => setLoading(false));
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await updateSiteSettings(formData);
            toast.success("Site settings updated");
            onUpdated && onUpdated(res.data);
            onClose();
        } catch (err) {
            toast.error("Could not update site settings");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Site Settings
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-slate-100"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {loading ? (
                    <p className="text-sm text-slate-500">Loading settings...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="site_email"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Site email
                            </label>
                            <input
                                id="site_email"
                                name="site_email"
                                type="email"
                                value={formData.site_email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="user@example.com"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="site_phone"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Site phone
                            </label>
                            <input
                                id="site_phone"
                                name="site_phone"
                                type="text"
                                value={formData.site_phone}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="+8801XXXXXXXXX"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label
                                htmlFor="site_location"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Site location
                            </label>
                            <input
                                id="site_location"
                                name="site_location"
                                type="text"
                                value={formData.site_location}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="Dhaka, Bangladesh"
                            />
                        </div>

                        {/* Copyright */}
                        <div>
                            <label
                                htmlFor="copyright_text"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Copyright text
                            </label>
                            <textarea
                                id="copyright_text"
                                name="copyright_text"
                                rows={3}
                                value={formData.copyright_text}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                placeholder="© 2025 Your company. All rights reserved."
                            />
                        </div>

                        {/* Actions */}
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

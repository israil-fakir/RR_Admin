import React, { useEffect, useState } from "react";
import { Banknote, CreditCard, ListChecks, Layers3, Globe2 } from "lucide-react"; // + Globe2

import {
  fetchPaymentProviders,
  createPaymentProvider,
  updatePaymentProvider,
} from "../../../api/admin/paymentProviders";

import PaymentProviderModal from "./paymentProviderModal";
import ServiceModal from "./ServiceModal";
import PlanModal from "./PlanModal";
import SiteSettingsModal from "./SiteSettingsModal"; // NEW

import { createService, fetchServices } from "../../../api/admin/servicesData";
import { createPlan } from "../../../api/admin/plans";

// Reusable card
function SettingCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
    >
      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </button>
  );
}

const initialProviderState = {
  manual: {
    id: null,
    title: "",
    provider_name_code: "",
    logo: null,
    account_number: "",
    description: "",
    is_active: true,
    bank_details: "",
    processing_fee_percentage: "",
    type: "",
    min_amount: "",
    max_amount: "",
  },
  riskpay: {
    id: null,
    title: "",
    provider_name_code: "",
    logo: null,
    account_number: "",
    description: "",
    is_active: true,
    bank_details: "",
    processing_fee_percentage: "",
    type: "",
    min_amount: "",
    max_amount: "",
  },
};

export default function Settings() {
  const [providerConfig, setProviderConfig] = useState(initialProviderState);
  const [openProvider, setOpenProvider] = useState(null); // "manual" | "riskpay" | null
  const [savingProvider, setSavingProvider] = useState(false);
  const [loading, setLoading] = useState(true);

  // services + modals
  const [services, setServices] = useState([]);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [serviceLoading, setServiceLoading] = useState(false);

  // plans + modal
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);

  // site settings modal
  const [siteSettingsOpen, setSiteSettingsOpen] = useState(false); // NEW

  // Load providers + services at mount
  useEffect(() => {
    async function loadSettingsData() {
      try {
        const [providers, servicesRes] = await Promise.all([
          fetchPaymentProviders(),
          fetchServices(),
        ]);

        const updated = { ...initialProviderState };

        providers.forEach((p) => {
          if (p.provider_name_code === "MANUAL_BANKING") {
            updated.manual = { ...updated.manual, ...p };
          } else if (p.provider_name_code === "RISKPAY") {
            updated.riskpay = { ...updated.riskpay, ...p };
          }
        });

        setProviderConfig(updated);
        setServices(servicesRes);
      } catch (err) {
        console.error("Failed to load settings data", err);
      } finally {
        setLoading(false);
      }
    }

    loadSettingsData();
  }, []);

  // Save payment provider
  const handleSaveProvider = async (providerKey, formValues) => {
    try {
      setSavingProvider(true);
      const isManual = providerKey === "manual";

      const fields = {
        title: formValues.title,
        provider_name_code: formValues.provider_name_code,
        description: formValues.description,
        is_active: formValues.is_active ?? true,
        processing_fee_percentage: formValues.processing_fee_percentage,
        type: formValues.type,
        min_amount: formValues.min_amount,
        max_amount: formValues.max_amount,
      };

      if (isManual) {
        if (formValues.account_number) {
          fields.account_number = formValues.account_number;
        }
        if (formValues.bank_details) {
          fields.bank_details = formValues.bank_details;
        }
      }

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      if (formValues.logo instanceof File) {
        formData.append("logo", formValues.logo);
      }

      let saved;
      if (formValues.id) {
        saved = await updatePaymentProvider(formValues.id, formData);
      } else {
        saved = await createPaymentProvider(formData);
      }

      setProviderConfig((prev) => ({
        ...prev,
        [providerKey]: { ...prev[providerKey], ...saved },
      }));

      alert(`Payment provider "${saved.title}" saved successfully.`);
      setOpenProvider(null);
    } catch (err) {
      console.error(err);
      alert("Could not save provider. Check console for details.");
    } finally {
      setSavingProvider(false);
    }
  };

  // Save Service (/api/services/)
  const handleSaveService = async (formValues) => {
    try {
      setServiceLoading(true);

      const payload = {
        name: formValues.name?.trim(),
        slug: formValues.slug?.trim(),
        description: formValues.description?.trim(),
        is_product: formValues.is_product,
      };

      const saved = await createService(payload);
      alert(`Service "${saved.name}" saved successfully.`);

      // update local list so that new services appear in PlanModal select
      setServices((prev) => [...prev, saved]);

      setServiceModalOpen(false);
    } catch (err) {
      console.error("Failed to save service", err);
      alert("Could not save service. Check console for details.");
    } finally {
      setServiceLoading(false);
    }
  };

  // Save Plan (/api/plans/)
  // Save Plan (/api/plans/)
const handleSavePlan = async (formValues) => {
  try {
    setPlanLoading(true);

    const payload = {
      // DRF usually expects the FK field name, not service_id
      service: Number(formValues.service),      // <-- important
      name: formValues.name?.trim(),
      slug: formValues.slug?.trim(),
      description: formValues.description?.trim(),
      price: String(formValues.price),
      billing_cycle: formValues.billing_cycle,
    };

    console.log("Plan payload:", payload);

    const saved = await createPlan(payload);
    alert(`Plan "${saved.name}" saved successfully.`);
    setPlanModalOpen(false);
  } catch (err) {
    console.error("Failed to save plan", err);
    console.error("Server response:", err.response?.data);
    alert("Could not save plan (server error). Check console for details.");
  } finally {
    setPlanLoading(false);
  }
};


  // always give provider modal a fresh empty object (create mode)
  const providerModalData =
    openProvider === "manual"
      ? { ...initialProviderState.manual }
      : openProvider === "riskpay"
      ? { ...initialProviderState.riskpay }
      : null;

  if (loading) {
    return (
      <div className="h-full w-full bg-background p-6">
        <h1 className="mb-4 text-xl font-semibold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background p-6">
      <h1 className="mb-4 text-xl font-semibold text-slate-800">Settings</h1>

      {/* Top cards: payment providers + services + plans + site settings */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SettingCard
          icon={Banknote}
          title="Manual or Banking"
          description="Configure bank transfer or manual payment instructions."
          onClick={() => setOpenProvider("manual")}
        />
        <SettingCard
          icon={CreditCard}
          title="Riskpay"
          description="Set up your Riskpay gateway configuration."
          onClick={() => setOpenProvider("riskpay")}
        />
        <SettingCard
          icon={ListChecks}
          title="Manage services"
          description="Create and manage services offered to your clients."
          onClick={() => setServiceModalOpen(true)}
        />
        <SettingCard
          icon={Layers3}
          title="Manage plans"
          description="Create subscription plans and pricing for your services."
          onClick={() => setPlanModalOpen(true)}
        />
        {/* NEW: Site settings card */}
        <SettingCard
          icon={Globe2}
          title="Site settings"
          description="Update site email, phone, location and footer text."
          onClick={() => setSiteSettingsOpen(true)}
        />
      </div>

      {/* Payment provider modal */}
      <PaymentProviderModal
        type={openProvider}
        open={Boolean(openProvider)}
        onClose={() => setOpenProvider(null)}
        data={providerModalData}
        onSave={handleSaveProvider}
        loading={savingProvider}
      />

      {/* Service modal */}
      <ServiceModal
        open={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        data={null}
        onSave={handleSaveService}
        loading={serviceLoading}
      />

      {/* Plan modal */}
      <PlanModal
        open={planModalOpen}
        onClose={() => setPlanModalOpen(false)}
        data={null}
        onSave={handleSavePlan}
        loading={planLoading}
        services={services}
      />

      {/* Site settings modal */}
      <SiteSettingsModal
        open={siteSettingsOpen}
        onClose={() => setSiteSettingsOpen(false)}
      />
    </div>
  );
}

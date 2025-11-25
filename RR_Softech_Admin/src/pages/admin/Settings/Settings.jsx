import React, { useEffect, useState } from "react";
import { Banknote, CreditCard, ListChecks, Layers3, Globe2 } from "lucide-react";

import {
  fetchPaymentProviders,
  createPaymentProvider,
  updatePaymentProvider,
} from "../../../api/admin/paymentProviders";

import PaymentProviderModal from "./paymentProviderModal";
import ServiceModal from "./ServiceModal";
import PlanModal from "./PlanModal";
import SiteSettingsModal from "./SiteSettingsModal";

import { createService, fetchServices } from "../../../api/admin/servicesData";
import { createPlan } from "../../../api/admin/plans";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

// Reusable card
function SettingCard({ icon: Icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-full w-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 text-left shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
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
  const [openProvider, setOpenProvider] = useState(null);
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
  const [siteSettingsOpen, setSiteSettingsOpen] = useState(false);

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

  // Save Service
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
      setServices((prev) => [...prev, saved]);
      setServiceModalOpen(false);
    } catch (err) {
      console.error("Failed to save service", err);
      alert("Could not save service. Check console for details.");
    } finally {
      setServiceLoading(false);
    }
  };

  // Save Plan
  const handleSavePlan = async (formValues) => {
    try {
      setPlanLoading(true);

      const payload = {
        service: Number(formValues.service),
        name: formValues.name?.trim(),
        slug: formValues.slug?.trim(),
        description: formValues.description?.trim(),
        price: String(formValues.price),
        billing_cycle: formValues.billing_cycle,
        features: (formValues.features || []).map((desc) => ({ description: desc })),
      };

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

  const providerModalData =
    openProvider === "manual"
      ? { ...initialProviderState.manual }
      : openProvider === "riskpay"
        ? { ...initialProviderState.riskpay }
        : null;

  // Fullscreen loading state
  if (loading) {
    return (
      <LoadingSpinner
        variant="fullscreen"
        size="lg"
        message="Loading Settings..."
      />
    );
  }

  return (
    <div className="relative bg-gray-50 h-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 border border-gray-200 rounded-xl overflow-x-hidden">
      <div className="bg-white rounded-2xl shadow-x border border-slate-200 px-4 py-4 sm:px-6 sm:py-6 mb-6 mx-auto space-y-8">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
          Settings
        </h1>

        {/* Section 1: Payment configuration */}
        <section className="space-y-3 bg-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Payment configuration
          </h2>
          <p className="text-sm text-slate-500">
            Configure how clients can pay you: manual banking and Riskpay
            payment gateway.
          </p>

          <div className="grid grid-cols-1 gap-5 mdx:grid-cols-2 md:grid-cols-1">
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
          </div>
        </section>

        {/* Section 2: Services & plans */}
        <section className="space-y-3 bg-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Services &amp; plans
          </h2>
          <p className="text-sm text-slate-500">
            Manage the services you offer and structure them into pricing plans.
          </p>

          <div className="grid grid-cols-1 gap-5 mdx:grid-cols-2 md:grid-cols-1">
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
          </div>
        </section>

        {/* Section 3: Site configuration */}
        <section className="space-y-3 bg-slate-100 rounded-xl p-4 border border-slate-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            Site configuration
          </h2>
          <p className="text-sm text-slate-500">
            Update global details like contact info, location and footer text.
          </p>

          <div className="grid grid-cols-1">
            <SettingCard
              icon={Globe2}
              title="Site settings"
              description="Update site email, phone, location and footer text."
              onClick={() => setSiteSettingsOpen(true)}
            />
          </div>
        </section>
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

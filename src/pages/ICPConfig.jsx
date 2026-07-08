import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ICPSection from "../components/ICP/ICPSection";

import {
  useICP,
  useICPConfig,
  useSaveICP,
  useDeleteICP,
} from "../hooks/queries/useICP";

import { isICPConfigured } from "../utils/icpUtils";

export default function ICPConfig() {
  const navigate = useNavigate();
  const [icp, setIcp] = useState({});

  const {
    data: sections = [],
    isLoading: configLoading,
  } = useICPConfig();

  const {
    data: icpData,
    isLoading: icpLoading,
  } = useICP();

  const {
    mutate: saveICP,
    isPending,
  } = useSaveICP();

  const {
    mutate: deleteICP,
    isPending: isDeleting,
  } = useDeleteICP();

  useEffect(() => {
    // Only set initial state to prevent overwriting user edits on background refetches
    if (icpData && Object.keys(icp).length === 0) {
      setIcp(icpData);
    }
  }, [icpData]);

  const toggleSelection = (field, value) => {
    setIcp((prev) => ({
      ...prev,
      [field]: prev[field]?.includes(value) // Check if value is already present
        ? prev[field].filter((item) => item !== value)
        : [...(prev[field] || []), value],
    }));
  };

  const alreadyConfigured = isICPConfigured(icpData);

  const handleSave = () => {
    const payload = {};

    sections.forEach((section) => {
      payload[section.field] = icp[section.field] || [];
    });

    // Every section must have at least one selection before the client can
    // unlock the dashboard.
    const missing = sections.filter(
      (section) =>
        (payload[section.field] || []).length === 0
    );

    if (missing.length > 0) {
      alert(
        "Please select at least one option in every section before saving:\n\n" +
          missing.map((s) => `• ${s.title}`).join("\n")
      );
      return;
    }

    saveICP(payload, {
      // Once a complete ICP is saved, unlock the app and send the client in.
      onSuccess: () => {
        navigate("/dashboard", { replace: true });
      },
    });
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Delete your saved ICP? Your dashboard will be locked until you set it up again."
    );

    if (!confirmed) return;

    deleteICP(undefined, {
      onSuccess: () => setIcp({}),
    });
  };

  if (configLoading || icpLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-white text-xl">
        {configLoading ? "Loading configuration..." : "Loading your ICP..."}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">No ICP configuration sections found.</div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* First-time setup notice: dashboard stays locked until ICP is saved */}
      {!alreadyConfigured && (
        <div className="bg-pink-500/10 border border-pink-500/40 rounded-xl p-4 text-pink-200">
          <p className="font-semibold text-white">
            Set up your Ideal Customer Profile to continue
          </p>
          <p className="text-sm mt-1">
            Your dashboard is locked until you select an option in
            every section below and save them.
          </p>
        </div>
      )}

      {/* Header */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            ICP Configuration
          </h1>

          <p className="text-gray-400 mt-2">
            Define your Ideal Customer Profile
          </p>
        </div>

        <div className="flex items-center gap-3">
          {alreadyConfigured && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-transparent border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete ICP"}
            </button>
          )}

          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl text-white font-semibold"
          >
            {isPending ? "Saving..." : "Save ICP"}
          </button>
        </div>
      </div>

      {/* Sections */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {sections.map((section) => (
          <ICPSection
            key={section.field}
            title={section.title}
            field={section.field}
            options={section.options}
            selectedValues={icp[section.field] || []}
            onToggle={toggleSelection}
          />
        ))}
      </div>
    </div>
  );
}

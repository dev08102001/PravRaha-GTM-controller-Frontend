import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import ICPSection from "../components/ICP/ICPSection";
import TechStackAccordion from "../components/ICP/TechStackAccordion";

import {
  useICP,
  useICPConfig,
  useTechStack,
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
    data: techStackCategories = [],
    isLoading: techStackLoading,
  } = useTechStack();

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
      [field]: prev[field]?.includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...(prev[field] || []), value],
    }));
  };

  const alreadyConfigured = isICPConfigured(icpData);

  // Non-tech sections from ICPConfig (flat Tech Stack removed server-side).
  const otherSections = sections.filter(
    (section) => String(section.field || "").toLowerCase() !== "techstack"
  );

  const handleSave = () => {
    const payload = {};

    otherSections.forEach((section) => {
      payload[section.field] = icp[section.field] || [];
    });

    // Selected technologies are stored as a flat string array on ICP.
    payload.techStack = icp.techStack || [];

    const missing = [];

    otherSections.forEach((section) => {
      if ((payload[section.field] || []).length === 0) {
        missing.push(section.title);
      }
    });

    if ((payload.techStack || []).length === 0) {
      missing.push("Tech Stack");
    }

    if (missing.length > 0) {
      toast.error(
        "Please select at least one option in every section before saving:\n\n" +
          missing.map((title) => `• ${title}`).join("\n")
      );
      return;
    }

    saveICP(payload, {
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

  if (configLoading || icpLoading || techStackLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-white text-xl">
        {configLoading || techStackLoading
          ? "Loading configuration..."
          : "Loading your ICP..."}
      </div>
    );
  }

  if (otherSections.length === 0 && techStackCategories.length === 0) {
    return (
      <div className="p-6 text-center text-gray-400">
        No ICP configuration sections found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {!alreadyConfigured && (
        <div className="bg-pink-500/10 border border-pink-500/40 rounded-xl p-4 text-pink-200">
          <p className="font-semibold text-white">
            Set up your Ideal Customer Profile to continue
          </p>
          <p className="text-sm mt-1">
            Your dashboard is locked until you select an option in every
            section below and save them.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">ICP Configuration</h1>

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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {otherSections.map((section) => (
          <ICPSection
            key={section.field}
            title={section.title}
            field={section.field}
            options={section.options}
            selectedValues={icp[section.field] || []}
            onToggle={toggleSelection}
          />
        ))}

        {techStackCategories.length > 0 && (
          <TechStackAccordion
            categories={techStackCategories}
            selectedValues={icp.techStack || []}
            onToggle={toggleSelection}
            field="techStack"
          />
        )}
      </div>
    </div>
  );
}

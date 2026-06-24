import { useEffect, useState } from "react";

import ICPSection from "../components/ICP/ICPSection";

import {
  useICP,
  useICPConfig,
  useSaveICP,
} from "../hooks/queries/useICP";

export default function ICPConfig() {
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

  const handleSave = () => {
    const payload = {};

    sections.forEach((section) => {
      payload[section.field] = icp[section.field] || [];
    });

    saveICP(payload);
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

        <button
          onClick={handleSave}
          disabled={isPending}
          className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl text-white font-semibold"
        >
          {isPending ? "Saving..." : "Save ICP"}
        </button>
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
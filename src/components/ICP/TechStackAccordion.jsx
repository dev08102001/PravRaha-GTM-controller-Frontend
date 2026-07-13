import { useState } from "react";
import ICPChip from "./ICPChip";

const Chevron = ({ open }) => (
  <svg
    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
      open ? "rotate-180" : ""
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const countSelectedInParent = (parent, selectedSet) => {
  let count = 0;
  for (const child of parent.children || []) {
    for (const tech of child.technologies || []) {
      if (selectedSet.has(tech)) count += 1;
    }
  }
  return count;
};

const countSelectedInChild = (child, selectedSet) =>
  (child.technologies || []).filter((tech) => selectedSet.has(tech)).length;

/**
 * 3-level Tech Stack accordion:
 * Parent (one open) → Child (one open per parent) → Technology chips (multi-select).
 */
export default function TechStackAccordion({
  categories = [],
  selectedValues = [],
  onToggle,
  field = "techStack",
}) {
  const [openParent, setOpenParent] = useState(null);
  const [openChildByParent, setOpenChildByParent] = useState({});

  const selectedSet = new Set(selectedValues);

  const toggleParent = (parentName) => {
    setOpenParent((prev) => (prev === parentName ? null : parentName));
  };

  const toggleChild = (parentName, childName) => {
    setOpenChildByParent((prev) => {
      const current = prev[parentName];
      return {
        ...prev,
        [parentName]: current === childName ? null : childName,
      };
    });
  };

  return (
    <div className="bg-[#151D2E] rounded-xl p-6 xl:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Tech Stack</h2>
          <p className="text-sm text-gray-400 mt-1">
            Expand a category, then a subcategory, and select technologies.
          </p>
        </div>
        {selectedValues.length > 0 && (
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            {selectedValues.length} selected
          </span>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedValues.map((tech) => (
            <ICPChip
              key={`selected-${tech}`}
              label={tech}
              selected
              onClick={() => onToggle(field, tech)}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {categories.map((parent) => {
          const parentOpen = openParent === parent.name;
          const parentSelected = countSelectedInParent(parent, selectedSet);
          const openChild = openChildByParent[parent.name] || null;

          return (
            <div
              key={parent.name}
              className="border border-[#2A3550] rounded-xl overflow-hidden bg-[#121A2B]"
            >
              {/* Level 1 — Parent */}
              <button
                type="button"
                onClick={() => toggleParent(parent.name)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors ${
                  parentOpen
                    ? "bg-cyan-500/10 text-white"
                    : "hover:bg-[#1C2538] text-gray-200"
                }`}
                aria-expanded={parentOpen}
              >
                <span className="font-semibold text-sm sm:text-base">
                  {parent.name}
                </span>
                <span className="flex items-center gap-2 text-gray-400">
                  {parentSelected > 0 && (
                    <span className="text-xs font-medium text-cyan-300">
                      {parentSelected}
                    </span>
                  )}
                  <Chevron open={parentOpen} />
                </span>
              </button>

              {parentOpen && (
                <div className="border-t border-[#2A3550] px-2 py-2 space-y-1.5 bg-[#0E1422]/sm:px-3">
                  {(parent.children || []).map((child) => {
                    const childOpen = openChild === child.name;
                    const childSelected = countSelectedInChild(
                      child,
                      selectedSet
                    );

                    return (
                      <div
                        key={`${parent.name}-${child.name}`}
                        className="rounded-lg border border-[#2A3550]/80 overflow-hidden"
                      >
                        {/* Level 2 — Child */}
                        <button
                          type="button"
                          onClick={() =>
                            toggleChild(parent.name, child.name)
                          }
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors ${
                            childOpen
                              ? "bg-[#1C2538] text-white"
                              : "hover:bg-[#1C2538]/70 text-gray-300"
                          }`}
                          aria-expanded={childOpen}
                        >
                          <span className="text-sm font-medium">
                            {child.name}
                          </span>
                          <span className="flex items-center gap-2 text-gray-500">
                            {childSelected > 0 && (
                              <span className="text-xs font-medium text-cyan-300">
                                {childSelected}
                              </span>
                            )}
                            <Chevron open={childOpen} />
                          </span>
                        </button>

                        {/* Level 3 — Technologies */}
                        {childOpen && (
                          <div className="px-3 pb-3 pt-1 border-t border-[#2A3550]/60 bg-[#151D2E]">
                            <div className="flex flex-wrap gap-2.5">
                              {(child.technologies || []).map((tech) => (
                                <ICPChip
                                  key={`${parent.name}-${child.name}-${tech}`}
                                  label={tech}
                                  selected={selectedSet.has(tech)}
                                  onClick={() => onToggle(field, tech)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

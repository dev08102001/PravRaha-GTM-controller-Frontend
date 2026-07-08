import ICPChip from "./ICPChip";

// Keep the first occurrence of each option (case-insensitive), e.g. one "APAC".
const uniqueOptions = (options = []) => {
  const seen = new Set();
  const result = [];

  for (const option of options) {
    const label = String(option ?? "").trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(label);
  }

  return result;
};

export default function ICPSection({
  title,
  field,
  options,
  selectedValues,
  onToggle,
}) {
  const chips = uniqueOptions(options);

  return (
    <div className="bg-[#151D2E] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        {title}
      </h2>

      <div className="flex flex-wrap gap-3">
        {chips.map((option) => (
          <ICPChip
            key={`${field}-${option}`}
            label={option}
            selected={selectedValues?.includes(option)}
            onClick={() =>
              onToggle(field, option)
            }
          />
        ))}
      </div>
    </div>
  );
}
import ICPChip from "./ICPChip";

export default function ICPSection({
  title,
  field,
  options,
  selectedValues,
  onToggle,
}) {
  return (
    <div className="bg-[#151D2E] rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        {title}
      </h2>

      <div className="flex flex-wrap gap-3">
        {options?.map((option) => (
          <ICPChip
            key={option}
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
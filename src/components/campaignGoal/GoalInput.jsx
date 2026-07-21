export default function GoalInput({ value, onChange }) {
  return (
    <textarea
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Generate 30 qualified meetings..."
      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4"
    />
  );
}
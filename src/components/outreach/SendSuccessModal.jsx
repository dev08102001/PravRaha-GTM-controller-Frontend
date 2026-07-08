import { useEffect } from "react";

const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";

const CONFETTI = [
  { left: "12%", color: "#22d3ee", delay: "0s" },
  { left: "28%", color: "#34d399", delay: ".15s" },
  { left: "44%", color: "#f472b6", delay: ".05s" },
  { left: "60%", color: "#a78bfa", delay: ".22s" },
  { left: "76%", color: "#facc15", delay: ".1s" },
  { left: "88%", color: "#22d3ee", delay: ".3s" },
];

export default function SendSuccessModal({ open, onClose, contact }) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    // Auto-dismiss after a short, delightful moment.
    const t = setTimeout(() => onClose?.(), 4200);

    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  const channel = contact?.channel === "LINKEDIN" ? "LinkedIn" : "Email";
  const destination =
    contact?.email || contact?.linkedinUrl || `${channel} contact`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <style>{`
        @keyframes os-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes os-pop {
          0% { opacity: 0; transform: scale(.85) translateY(12px) }
          100% { opacity: 1; transform: scale(1) translateY(0) }
        }
        @keyframes os-ring {
          0% { transform: scale(.6); opacity: 0 }
          55% { opacity: .55 }
          100% { transform: scale(1.7); opacity: 0 }
        }
        @keyframes os-check {
          from { stroke-dashoffset: 48 }
          to { stroke-dashoffset: 0 }
        }
        @keyframes os-confetti {
          0% { transform: translateY(10px) rotate(0deg); opacity: 1 }
          100% { transform: translateY(-130px) rotate(420deg); opacity: 0 }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        style={{ animation: "os-fade .2s ease-out" }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-b from-[#0E1A33] to-[#0A1226] p-8 text-center shadow-[0_0_60px_-12px_rgba(34,211,238,0.55)]"
        style={{ animation: "os-pop .35s cubic-bezier(.2,.8,.2,1)" }}
      >
        {/* Confetti */}
        <div className="pointer-events-none absolute inset-x-0 top-6 h-0">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute block h-2 w-2 rounded-[2px]"
              style={{
                left: c.left,
                backgroundColor: c.color,
                animation: `os-confetti 1.5s ${c.delay} ease-out forwards`,
              }}
            />
          ))}
        </div>

        {/* Success ring + check */}
        <div className="relative mx-auto mb-6 h-24 w-24">
          <span
            className="absolute inset-0 rounded-full bg-cyan-400/30"
            style={{ animation: "os-ring 1.5s ease-out infinite" }}
          />
          <span
            className="absolute inset-0 rounded-full bg-emerald-400/20"
            style={{ animation: "os-ring 1.5s .45s ease-out infinite" }}
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 shadow-lg shadow-cyan-500/30">
            <svg viewBox="0 0 52 52" className="h-12 w-12">
              <path
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27 l8 8 l16 -18"
                style={{
                  strokeDasharray: 48,
                  strokeDashoffset: 48,
                  animation: "os-check .5s .25s ease-out forwards",
                }}
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Message Sent!
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Your outreach is on its way 🚀
        </p>

        {/* Contact card */}
        {contact && (
          <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 font-bold text-pink-300">
                {initialsOf(contact.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {contact.name}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {[contact.role, contact.company]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-slate-900/60 px-3 py-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Sent via {channel}
              </span>
              <span className="max-w-[60%] truncate text-right text-xs font-medium text-cyan-300">
                {destination}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-7 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  );
}

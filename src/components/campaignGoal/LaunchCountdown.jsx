import { useEffect, useState } from "react";

const BOOT_LINES = [
  "Initializing GTM Controller...",
  "Connecting to data warehouse...",
  "Loading Ideal Customer Profile...",
  "Priming agent pipeline...",
  "Deploying autonomous agents...",
];

/*
|--------------------------------------------------------------------------
| LAUNCH COUNTDOWN
|--------------------------------------------------------------------------
| Full-screen, on-theme countdown shown after the client clicks
| "Launch Agents". Counts down from `seconds` then calls onComplete()
| (which routes to the Agent Monitor).
*/
export default function LaunchCountdown({
  seconds = 5,
  onComplete,
}) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (count <= 0) {
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }

    const timer = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  const total = seconds;
  const elapsed = total - count;
  const progress = Math.min(elapsed / total, 1);

  // SVG ring geometry
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - progress);

  const activeLine =
    BOOT_LINES[Math.min(elapsed, BOOT_LINES.length - 1)];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050B1A]/95 backdrop-blur-sm overflow-hidden">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.15) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse" />
      <div className="absolute w-[260px] h-[260px] rounded-full bg-pink-500/10 blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center text-center px-6">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-[#D4AE6A] text-2xl font-bold tracking-wide">
            PravRaha
          </span>
          <span className="text-gray-500 text-sm uppercase tracking-[0.3em]">
            GTM Controller
          </span>
        </div>

        {/* Countdown ring */}
        <div className="relative w-[220px] h-[220px]">
          <svg
            className="w-full h-full -rotate-90"
            viewBox="0 0 220 220"
          >
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="#11203B"
              strokeWidth="10"
            />
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke="url(#countdownGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashoffset}
              style={{
                transition:
                  "stroke-dashoffset 1s linear",
              }}
            />
            <defs>
              <linearGradient
                id="countdownGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>

          {/* Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              key={count}
              className="text-7xl font-extrabold text-white animate-[ping_0.3s_ease-out] [animation-iteration-count:1]"
            >
              {count > 0 ? count : "Go"}
            </span>
            <span className="text-xs uppercase tracking-[0.25em] text-cyan-400 mt-1">
              Launching
            </span>
          </div>
        </div>

        {/* Boot log */}
        <div className="mt-10 h-6">
          <p className="font-mono text-sm text-cyan-300/90">
            <span className="text-emerald-400">›</span>{" "}
            {activeLine}
          </p>
        </div>

        <p className="mt-2 text-gray-500 text-sm">
          Redirecting to Agent Monitor...
        </p>
      </div>
    </div>
  );
}

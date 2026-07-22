import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getOutreachDetails } from "../../services/outreachService";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const formatRemaining = (ms) => {
  if (ms == null) return null;
  if (ms <= 0) return "Ready now";

  const totalMinutes = Math.floor(ms / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days} Day${days === 1 ? "" : "s"}${
      hours > 0 ? ` ${hours} Hr` : ""
    } Remaining`;
  }
  if (hours > 0) {
    return `${hours} Hour${hours === 1 ? "" : "s"}${
      minutes > 0 ? ` ${minutes} Min` : ""
    } Remaining`;
  }
  return `${minutes} Minute${minutes === 1 ? "" : "s"} Remaining`;
};

const formatIntervalLabel = (hours) => {
  const h = Number(hours) || 24;
  if (h === 0.5) return "30 Min";
  return h % 24 === 0 && h >= 48 ? `${h}h · ${h / 24} Days` : `${h} Hours`;
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : null);

const AVATAR_GRADIENTS = [
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-violet-600",
];
const gradientFor = (seed = "") => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
};

const STEP_STYLES = {
  SENT: {
    dot: "bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white shadow-lg shadow-emerald-500/30",
    line: "bg-gradient-to-b from-emerald-500/70 to-emerald-500/20",
    badge: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
    symbol: "✓",
  },
  SCHEDULED: {
    dot: "bg-gradient-to-br from-violet-500 to-purple-600 border-violet-400 text-white shadow-lg shadow-violet-500/30",
    line: "bg-gradient-to-b from-violet-500/60 to-violet-500/15",
    badge: "bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/30",
    symbol: "🕒",
  },
  PENDING: {
    dot: "bg-[#141D33] border-[#2A3550] text-gray-500",
    line: "bg-[#22304F]",
    badge: "bg-[#192540] text-gray-400 ring-1 ring-[#2A3550]",
    symbol: "○",
  },
  CANCELLED: {
    dot: "bg-red-500/15 border-red-500/40 text-red-300",
    line: "bg-red-500/25",
    badge: "bg-red-500/10 text-red-300/80 ring-1 ring-red-500/30",
    symbol: "✕",
  },
  FAILED: {
    dot: "bg-gradient-to-br from-red-500 to-rose-600 border-red-400 text-white shadow-lg shadow-red-500/30",
    line: "bg-red-500/30",
    badge: "bg-red-500/15 text-red-300 ring-1 ring-red-500/40",
    symbol: "!",
  },
};

const styleFor = (status) => STEP_STYLES[status] || STEP_STYLES.PENDING;

const statusLabel = (step) => {
  if (step.status === "SENT") {
    return step.delivery?.simulated ? "Sent (simulated)" : "Sent";
  }
  if (step.status === "SCHEDULED") return "Scheduled";
  if (step.status === "CANCELLED") return "Cancelled";
  if (step.status === "FAILED") return "Failed";
  return "Pending";
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function InfoRow({ label, value, valueClass = "" }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm py-1.5 border-b border-[#1A2440] last:border-0">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className={`text-gray-200 text-right break-words min-w-0 ${valueClass}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function StatChip({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-[#22304F] bg-[#0E1626]/80 px-3 py-2.5 text-center min-w-[5.5rem]">
      <p className={`text-lg font-extrabold leading-none ${accent}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1.5">
        {label}
      </p>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="rounded-2xl border border-[#22304F] bg-[#0E1626]/80 p-4">
      <h3 className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-2">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 flex-1 rounded-xl bg-[#141D33]" />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[#22304F] bg-[#0E1626] p-4 space-y-3"
          >
            <div className="h-3 w-28 rounded bg-[#1C2740]" />
            <div className="h-4 w-3/4 rounded bg-[#1C2740]" />
            <div className="h-4 w-1/2 rounded bg-[#1C2740]" />
            <div className="h-4 w-2/3 rounded bg-[#1C2740]" />
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[#22304F] bg-[#0E1626] p-4 space-y-4">
        <div className="h-3 w-28 rounded bg-[#1C2740]" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1C2740] shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-[#1C2740]" />
              <div className="h-3 w-1/3 rounded bg-[#1C2740]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Centered details modal                                              */
/* ------------------------------------------------------------------ */

export default function OutreachDetailsDrawer({ outreachId, onClose }) {
  const open = Boolean(outreachId);

  // Tick every 30s so countdowns stay current while the modal is open.
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!open) return undefined;
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const {
    data: details,
    isLoading,
    isError,
    error,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ["outreach-details", outreachId],
    queryFn: () => getOutreachDetails(outreachId),
    enabled: open,
    // Cache per row so reopening the same contact is instant.
    staleTime: 60_000,
  });

  if (!open) return null;

  const timeline = details?.timeline || [];
  const stats = details?.stats || {};

  // Highlight the step the sequence is currently at: the next actionable one,
  // or the last sent step when the sequence is finished/stopped.
  const currentIdx = (() => {
    const next = timeline.findIndex((s) =>
      ["PENDING", "SCHEDULED", "FAILED"].includes(s.status)
    );
    if (next !== -1 && !details?.replyReceived && !details?.sequenceCancelled) {
      return next;
    }
    for (let i = timeline.length - 1; i >= 0; i--) {
      if (timeline[i].status === "SENT") return i;
    }
    return -1;
  })();

  const liveRemainingMs =
    details?.nextScheduledAt != null
      ? Math.max(0, new Date(details.nextScheduledAt).getTime() - now)
      : details?.remainingMs != null
        ? Math.max(0, details.remainingMs - (now - dataUpdatedAt))
        : null;

  const seed = details?.recipient?.name || details?.recipient?.email || "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#2A3550] bg-[#0B1120] shadow-[0_0_80px_-20px_rgba(34,211,238,0.35)] overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-[#22304F] bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-transparent">
          <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 blur-3xl pointer-events-none" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${gradientFor(seed)} flex items-center justify-center font-bold text-white text-lg shadow-lg`}
              >
                {details?.recipient?.initials || "…"}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-cyan-300/80 font-semibold">
                  Outreach Details
                </p>
                <h2 className="text-xl font-bold text-white truncate">
                  {details?.recipient?.name || "Loading…"}
                </h2>
                <p className="text-sm text-gray-400 truncate">
                  {[details?.recipient?.role, details?.recipient?.company]
                    .filter(Boolean)
                    .join(" • ") || "\u00A0"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {details && (
                <span
                  className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${
                    details.replyReceived
                      ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30"
                      : "bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30"
                  }`}
                >
                  {details.currentStatus}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl border border-[#2A3550] text-gray-400 hover:text-white hover:border-cyan-500/50 text-xl leading-none transition"
                aria-label="Close details"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading && <Skeleton />}

          {isError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-4 text-sm text-red-300">
              {error?.response?.data?.message ||
                "Failed to load outreach details. Please try again."}
            </div>
          )}

          {!isLoading && !isError && !details && (
            <div className="rounded-xl border border-dashed border-[#2A3550] px-4 py-10 text-center text-gray-400 text-sm">
              No details available for this outreach.
            </div>
          )}

          {!isLoading && !isError && details && (
            <>
              {/* Quick stats */}
              <div className="flex flex-wrap gap-3">
                <StatChip
                  label="Emails Total"
                  value={stats.totalEmails ?? timeline.length}
                  accent="text-white"
                />
                <StatChip
                  label="Sent"
                  value={stats.sent ?? 0}
                  accent="text-emerald-300"
                />
                <StatChip
                  label="Pending"
                  value={(stats.pending ?? 0) + (stats.scheduled ?? 0)}
                  accent="text-amber-300"
                />
                <StatChip
                  label="Interval"
                  value={formatIntervalLabel(
                    details.followUps.followUpIntervalHours
                  )}
                  accent="text-cyan-300"
                />
                {details.recipient.score != null && (
                  <StatChip
                    label="Lead Score"
                    value={details.recipient.score}
                    accent="text-fuchsia-300"
                  />
                )}
                {details.campaign.batch != null && (
                  <StatChip
                    label="Batch"
                    value={`#${details.campaign.batch}`}
                    accent="text-gray-200"
                  />
                )}
              </div>

              {/* Countdown / reply banner */}
              {details.replyReceived ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-600/15 to-transparent p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-emerald-300 font-semibold">
                        ✓ Contact replied — sequence stopped
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {details.reply?.receivedAt
                          ? `Received ${formatDate(details.reply.receivedAt)}`
                          : "Reply recorded"}
                        {details.reply?.from ? ` · from ${details.reply.from}` : ""}
                      </p>
                    </div>
                  </div>
                  {(details.reply?.subject || details.reply?.preview) && (
                    <div className="mt-3 rounded-xl bg-[#0E1626]/80 border border-emerald-500/20 p-3">
                      {details.reply.subject && (
                        <p className="text-sm text-white font-medium truncate">
                          {details.reply.subject}
                        </p>
                      )}
                      {details.reply.preview && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2 whitespace-pre-line">
                          {details.reply.preview}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : details.sequenceCancelled ? (
                <div className="rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/10 to-transparent p-4">
                  <p className="text-red-300 font-semibold">Sequence cancelled</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Remaining follow-ups will not be sent.
                  </p>
                </div>
              ) : liveRemainingMs != null ? (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-600/15 via-orange-600/5 to-transparent p-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-500">
                      Next Email Countdown
                    </p>
                    <p className="text-2xl font-extrabold text-amber-300 mt-0.5">
                      {formatRemaining(liveRemainingMs)}
                    </p>
                  </div>
                  {details.nextScheduledAt && (
                    <div className="text-right text-xs text-gray-400">
                      <p className="text-[11px] uppercase tracking-wider text-gray-500">
                        Scheduled For
                      </p>
                      <p className="text-gray-200 font-medium mt-0.5">
                        {formatDate(details.nextScheduledAt)}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#22304F] bg-[#0E1626]/80 p-4">
                  <p className="text-gray-300 font-medium">
                    No follow-up scheduled
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    The sequence has finished or is waiting for the first send.
                  </p>
                </div>
              )}

              {/* Recipient + Campaign side by side */}
              <div className="grid md:grid-cols-2 gap-4">
                <Section title="Recipient" icon="👤">
                  <InfoRow label="Contact" value={details.recipient.name} />
                  <InfoRow label="Job Title" value={details.recipient.role} />
                  <InfoRow label="Company" value={details.recipient.company} />
                  <InfoRow
                    label="Email"
                    value={details.recipient.email}
                    valueClass="text-cyan-300"
                  />
                  <InfoRow label="Location" value={details.recipient.location} />
                  <InfoRow
                    label="Timezone"
                    value={
                      details.recipient.timezoneLabel ||
                      details.recipient.timezone
                    }
                  />
                  {details.recipient.linkedinUrl && (
                    <InfoRow
                      label="LinkedIn"
                      value={
                        <a
                          href={details.recipient.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline break-all"
                        >
                          Open profile ↗
                        </a>
                      }
                    />
                  )}
                </Section>

                <Section title="Campaign & Delivery" icon="🎯">
                  <InfoRow label="Campaign" value={details.campaign.name} />
                  <InfoRow
                    label="Configuration"
                    value={details.campaign.configName}
                  />
                  <InfoRow label="Channel" value={details.campaign.channel} />
                  <InfoRow
                    label="Follow-ups"
                    value={`${details.followUps.maxFollowUps} configured · ${details.followUps.followUpCount} sent`}
                  />
                  <InfoRow
                    label="Interval"
                    value={formatIntervalLabel(
                      details.followUps.followUpIntervalHours
                    )}
                    valueClass="text-cyan-300"
                  />
                  <InfoRow
                    label="Sent From"
                    value={details.delivery.fromEmail}
                  />
                  <InfoRow
                    label="Provider"
                    value={details.delivery.provider}
                    valueClass="capitalize"
                  />
                  <InfoRow
                    label="First Sent"
                    value={formatDate(details.delivery.firstSentAt)}
                  />
                  <InfoRow
                    label="Last Activity"
                    value={formatDate(details.delivery.lastSentAt)}
                  />
                </Section>
              </div>

              {/* Signal context */}
              {details.campaign.context && (
                <Section title="Signal Context" icon="📡">
                  <p className="text-sm text-emerald-300/90 italic leading-6">
                    {details.campaign.context}
                  </p>
                </Section>
              )}

              {/* Timeline */}
              <Section title="Email Timeline" icon="📨">
                {timeline.length === 0 ? (
                  <p className="text-sm text-gray-500 py-2">
                    No emails in this sequence yet.
                  </p>
                ) : (
                  <ol className="mt-2">
                    {timeline.map((step, idx) => {
                      const style = styleFor(step.status);
                      const isCurrent = idx === currentIdx;
                      const isLast = idx === timeline.length - 1;
                      const remaining =
                        !details.replyReceived &&
                        !details.sequenceCancelled &&
                        ["PENDING", "SCHEDULED"].includes(step.status) &&
                        step.scheduledAt
                          ? formatRemaining(
                              Math.max(
                                0,
                                new Date(step.scheduledAt).getTime() - now
                              )
                            )
                          : null;

                      return (
                        <li
                          key={step.step}
                          className="relative flex gap-4 pb-6 last:pb-0"
                        >
                          {!isLast && (
                            <span
                              className={`absolute left-[15px] top-9 bottom-0 w-0.5 rounded ${style.line}`}
                            />
                          )}

                          <span
                            className={`relative z-10 w-8 h-8 shrink-0 rounded-full border flex items-center justify-center text-[14px] font-bold ${style.dot} ${
                              isCurrent
                                ? "ring-2 ring-cyan-400/70 ring-offset-2 ring-offset-[#0B1120]"
                                : ""
                            }`}
                          >
                            {style.symbol}
                          </span>

                          <div
                            className={`flex-1 min-w-0 rounded-xl px-4 py-3 -mt-1 border transition ${
                              isCurrent
                                ? "bg-cyan-500/[0.07] border-cyan-500/40 shadow-[0_0_25px_-10px_rgba(34,211,238,0.5)]"
                                : "bg-[#0B1322]/60 border-[#1A2440]"
                            }`}
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-sm text-white">
                                Mail {step.step + 1}
                                <span className="text-gray-500 font-normal">
                                  {" "}
                                  · {step.label}
                                </span>
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${style.badge}`}
                              >
                                {statusLabel(step)}
                              </span>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 ring-1 ring-cyan-500/30">
                                  Current Stage
                                </span>
                              )}
                            </div>

                            {step.subject && (
                              <p className="text-xs text-gray-300 truncate mt-1.5">
                                ✉ {step.subject}
                              </p>
                            )}

                            <div className="text-[11px] text-gray-500 mt-1.5 space-y-0.5">
                              {step.status === "SENT" && step.sentAt && (
                                <p>Sent {formatDate(step.sentAt)}</p>
                              )}
                              {["PENDING", "SCHEDULED"].includes(step.status) &&
                                step.scheduledAt && (
                                  <p>
                                    {step.projected ? "Expected" : "Scheduled"}{" "}
                                    {formatDate(step.scheduledAt)}
                                    {remaining ? (
                                      <span className="text-amber-300/90 font-medium">
                                        {" "}
                                        · {remaining}
                                      </span>
                                    ) : null}
                                  </p>
                                )}
                              {step.delivery?.provider &&
                                step.status === "SENT" && (
                                  <p>
                                    Delivered via {step.delivery.provider}
                                    {step.delivery.to
                                      ? ` to ${step.delivery.to}`
                                      : ""}
                                  </p>
                                )}
                              {step.status === "FAILED" &&
                                step.delivery?.error && (
                                  <p className="text-red-300/90">
                                    {step.delivery.error}
                                  </p>
                                )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </Section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#22304F] bg-[#0C1424]/80 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 px-5 py-2 rounded-lg font-semibold text-white text-sm shadow-lg shadow-cyan-500/20 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

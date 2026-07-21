import { useEffect, useState } from "react";

const formatInTimezone = (date, timezone = "UTC") => {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
};

export default function ContactLocalTime({ timezone = "UTC", className = "" }) {
  const [now, setNow] = useState(() => new Date());
  const tz = timezone || "UTC";

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className}>{formatInTimezone(now, tz)}</span>
  );
}

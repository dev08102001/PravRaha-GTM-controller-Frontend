import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveSignalFeed } from "../../services/signalService";
import GoalInput from "./GoalInput";
import LaunchButton from "./LaunchButton";
import LaunchCountdown from "./LaunchCountdown";

// Broadcast a prompt so the dashboard's Live Signal Feed re-queries the DB.
const broadcastPrompt = (prompt) => {
  try {
    localStorage.setItem("gtm:lastPrompt", prompt);
    window.dispatchEvent(new CustomEvent("gtm:prompt", { detail: prompt }));
  } catch {
    /* localStorage unavailable — feed still works via its own search box. */
  }
};

export default function CampaignGoalCard() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(() => {
    try {
      return localStorage.getItem("gtm:lastPrompt") || "";
    } catch {
      return "";
    }
  });
  const [counting, setCounting] = useState(false);

  // As the client types the goal, live-update dashboard widgets (debounced).
  useEffect(() => {
    const trimmed = goal.trim();
    const t = setTimeout(() => broadcastPrompt(trimmed), 400);
    return () => clearTimeout(t);
  }, [goal]);

  const handleLaunch = async () => {
    const trimmed = goal.trim();
    if (!trimmed) {
      alert("Please enter a campaign goal");
      return;
    }

    broadcastPrompt(trimmed);

    try {
      await saveSignalFeed(trimmed);
    } catch (err) {
      console.error("Failed to save signal feed companies:", err);
    }

    setCounting(true);
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl">
      {counting && (
        <LaunchCountdown
          seconds={5}
          onComplete={() =>
            navigate("/agents", { state: { goal: goal.trim() } })
          }
        />
      )}

      <h2 className="text-xl font-bold mb-4">
        Campaign Goal
      </h2>

      <GoalInput
        value={goal}
        onChange={setGoal}
      />

      <div className="mt-4">
        <LaunchButton
          onClick={counting ? undefined : handleLaunch}
          label={counting ? "Launching agents..." : undefined}
        />
      </div>
    </div>
  );
}

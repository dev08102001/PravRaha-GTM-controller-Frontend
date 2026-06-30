import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [goal, setGoal] = useState("");
  const [counting, setCounting] = useState(false);

  // As the client types the goal, live-update the Live Signal Feed with
  // signals related to the prompt (debounced so we don't spam the API).
  useEffect(() => {
    const trimmed = goal.trim();
    if (!trimmed) return;

    const t = setTimeout(() => broadcastPrompt(trimmed), 500);
    return () => clearTimeout(t);
  }, [goal]);

  const handleLaunch = () => {
    const trimmed = goal.trim();
    if (!trimmed) {
      alert("Please enter a campaign goal");
      return;
    }

    // Reflect this prompt in the dashboard's Live Signal Feed immediately
    // (also persisted, so it stays when the client returns to the dashboard).
    broadcastPrompt(trimmed);

    // Don't start the pipeline here. Play the countdown, then route to the
    // Agent Monitor and start the run THERE so the client watches the agents
    // execute one-by-one from the very first agent.
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

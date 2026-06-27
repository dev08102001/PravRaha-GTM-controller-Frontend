import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GoalInput from "./GoalInput";
import LaunchButton from "./LaunchButton";
import LaunchCountdown from "./LaunchCountdown";

export default function CampaignGoalCard() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState("");
  const [counting, setCounting] = useState(false);

  const handleLaunch = () => {
    if (!goal.trim()) {
      alert("Please enter a campaign goal");
      return;
    }

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

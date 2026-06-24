import { useState } from "react";
import GoalInput from "./GoalInput";
import LaunchButton from "./LaunchButton";
import { createCampaign } from "../../services/campaignService";

export default function CampaignGoalCard() {

  const [goal, setGoal] = useState("");

  const handleCreate = async () => {
    if (!goal.trim()) {
  alert("Please enter a campaign goal");
  return;
}

    try {

      const payload = {
        goal,
      };

      const res = await createCampaign(payload);

      console.log(res);

      alert("Campaign Created");

    } catch (error) {
  console.error(error);

  alert(
    error?.response?.data?.message ||
    "Failed to create campaign"
  );
}
  };

  return (
    <div className="bg-slate-900 p-6 rounded-xl">

      <h2 className="text-xl font-bold mb-4">
        Campaign Goal
      </h2>

      <GoalInput
        value={goal}
        onChange={setGoal}
      />

      <div className="mt-4">
        <LaunchButton
          onClick={handleCreate}
        />
      </div>

    </div>
  );
}
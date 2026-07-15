// import { useEffect, useState } from "react";
// import api from "../services/api";

// export default function GoalInput() {
//   const [goal, setGoal] = useState(null);

//   useEffect(() => {
//     fetchGoal();
//   }, []);

//   const fetchGoal = async () => {
//     try {
//       const response = await api.get("/goal");
//       setGoal(response.data);
//     } catch (error) {
//       console.error("Goal Fetch Error:", error);
//     }
  
//   }
  

//   if (!goal) {
//     return (
//       <div className="bg-[#151D2E] rounded-2xl p-6">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">

//       <div className="mb-5">
//         <div className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">
//           Campaign Goal — Natural Language Input
//         </div>
//       </div>

//       <div className="bg-[#24304A]/70 border border-slate-600 rounded-xl p-6">
//         <p className="text-lg font-semibold leading-8 text-white">
//           {goal.goalText}
//         </p>
//       </div>

//       <div className="flex items-center justify-between flex-wrap gap-4 mt-6">

//         <div className="flex flex-wrap gap-3">
//           {goal.templates?.map((template, index) => (
//             <button
//               key={index}
//               className="bg-[#24304A] hover:bg-[#2B3755] px-4 py-2 rounded-xl text-sm"
//             >
//               {template}
//             </button>
//           ))}
//         </div>

//         <button className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition">
//           ⚡ Launch Agents
//         </button>

//       </div>

//     </div>
//   );
// }




// import useGoal from "../hooks/queries/useGoal";

// export default function GoalInput() {
//   const {
//     data: goal,
//     isLoading,
//     error,
//   } = useGoal();

//   if (isLoading) {
//     return (
//       <div className="bg-[#151D2E] rounded-2xl p-6">
//         Loading Goal...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-[#151D2E] rounded-2xl p-6 text-red-500">
//         Failed to load goal
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//       <div className="mb-5">
//         <div className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">
//           Campaign Goal — Natural Language Input
//         </div>
//       </div>

//       <div className="bg-[#24304A]/70 border border-slate-600 rounded-xl p-6">
//         <p className="text-lg font-semibold leading-8 text-white">
//           {goal?.goalText}
//         </p>
//       </div>

//       <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
//         <div className="flex flex-wrap gap-3">
//           {goal?.templates?.map(
//             (template, index) => (
//               <button
//                 key={index}
//                 className="bg-[#24304A] hover:bg-[#2B3755] px-4 py-2 rounded-xl text-sm"
//               >
//                 {template}
//               </button>
//             )
//           )}
//         </div>

//         <button className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition">
//           ⚡ Launch Agents
//         </button>
//       </div>
//     </div>
//   );
// }
import toast from "react-hot-toast";
import useGoal from "../hooks/queries/useGoal";

export default function GoalInput() {
  const {
    data: goal,
    isLoading,
    error,
  } = useGoal();

  const handleTemplateClick = (template) => {
    toast.success(`Template Selected: ${template}`);
  };

  const handleLaunchAgents = () => {
    toast.success("Launch Agents clicked");
  };

  if (isLoading) {
    return (
      <div className="bg-[#151D2E] rounded-2xl p-6">
        Loading Goal...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#151D2E] rounded-2xl p-6 text-red-500">
        Failed to load goal
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
      <div className="mb-5">
        <div className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">
          Campaign Goal — Natural Language Input
        </div>
      </div>

      <div className="bg-[#24304A]/70 border border-slate-600 rounded-xl p-6">
        <p className="text-lg font-semibold leading-8 text-white">
          {goal?.goalText}
        </p>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
        <div className="flex flex-wrap gap-3">
          {goal?.templates?.map((template, index) => (
            <button
              key={index}
              onClick={() => handleTemplateClick(template)}
              className="bg-[#24304A] hover:bg-[#2B3755] px-4 py-2 rounded-xl text-sm"
            >
              {template}
            </button>
          ))}
        </div>

        <button
          onClick={handleLaunchAgents}
          className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          ⚡ Launch Agents
        </button>
      </div>
    </div>
  );
}
// import useAgents from "../hooks/queries/useAgents";

// export default function AgentActivity() {
//   const {
//     data: agents = [],
//     isLoading,
//     isError,
//   } = useAgents();

//   if (isLoading) {
//     return (
//       <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
//         Loading agent activity...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
//         Failed to load agent activity
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden">
//       <div className="flex justify-between items-center p-6 border-b border-slate-700">
//         <div>
//           <h2 className="text-2xl font-bold">
//             🤖 Agent Activity
//           </h2>

//           <p className="text-gray-400 text-sm mt-1">
//             Real-time agent task execution log
//           </p>
//         </div>

//         <button className="text-cyan-400 hover:text-cyan-300">
//           Monitor →
//         </button>
//       </div>

//       <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm">
//         {agents.map((agent) => (
//           <div
//             key={agent._id}
//             className="flex gap-3 mb-3"
//           >
//             <span className="text-gray-500 min-w-[70px]">
//               {agent.time}
//             </span>

//             <span className="text-cyan-300">
//               {agent.message}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import useAgents from "../hooks/queries/useAgents";

export default function AgentActivity() {
  const {
    data: agents = [],
    isLoading,
    isError,
  } = useAgents();

  const handleMonitor = () => {
    alert("Monitor clicked");
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        Loading agent activity...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
        Failed to load agent activity
      </div>
    );
  }

  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold">
            🤖 Agent Activity
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            Real-time agent task execution log
          </p>
        </div>

        <button
          onClick={handleMonitor}
          className="text-cyan-400 hover:text-cyan-300"
        >
          Monitor →
        </button>
      </div>

      <div className="p-4 max-h-[500px] overflow-y-auto font-mono text-sm">
        {agents.map((agent) => (
          <div
            key={agent._id}
            className="flex gap-3 mb-3"
          >
            <span className="text-gray-500 min-w-[70px]">
              {agent.time}
            </span>

            <span className="text-cyan-300">
              {agent.message}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
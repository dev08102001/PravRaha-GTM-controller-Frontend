// import useSignals from "../hooks/queries/useSignals";

// export default function LiveSignalFeed() {
//   const {
//     data: signals = [],
//     isLoading,
//     isError,
//   } = useSignals();

//   if (isLoading) {
//     return (
//       <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
//         Loading signals...
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
//         Failed to load signals
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden">
//       <div className="flex justify-between items-center p-6 border-b border-slate-700">
//         <div>
//           <h2 className="text-2xl font-bold">
//             ⚡ Live Signal Feed
//           </h2>

//           <p className="text-gray-400 text-sm mt-1">
//             High-confidence buying signals detected today
//           </p>
//         </div>

//         <button className="text-cyan-400 hover:text-cyan-300">
//           View all →
//         </button>
//       </div>

//       {/* Scrollable Signals List */}
//       <div className="max-h-[500px] overflow-y-scroll">
//         {signals.map((signal) => (
//           <div
//             key={signal._id}
//             className="flex justify-between items-center p-5 border-b border-slate-700 last:border-b-0"
//           >
//             <div>
//               <h3 className="font-bold text-lg">
//                 {signal.company}
//               </h3>

//               <p className="text-gray-400 mt-1">
//                 {signal.description}
//               </p>

//               <div className="flex items-center gap-3 mt-3">
//                 <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
//                   {signal.type}
//                 </span>

//                 <span className="text-xs text-gray-500">
//                   {signal.timeAgo}
//                 </span>
//               </div>
//             </div>

//             <div className="text-cyan-400 text-2xl font-bold">
//               {signal.score}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import useSignals from "../hooks/queries/useSignals";

export default function LiveSignalFeed() {
  const {
    data: signals = [],
    isLoading,
    isError,
  } = useSignals();

  const handleViewAll = () => {
    alert("View All clicked");
  };

  if (isLoading) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6">
        Loading signals...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#1A2340] border border-slate-700 rounded-2xl p-6 text-red-400">
        Failed to load signals
      </div>
    );
  }

  return (
    <div className="bg-[#1A2340] border border-slate-700 rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <div>
          <h2 className="text-2xl font-bold">
            ⚡ Live Signal Feed
          </h2>

          <p className="text-gray-400 text-sm mt-1">
            High-confidence buying signals detected today
          </p>
        </div>

        <button
          onClick={handleViewAll}
          className="text-cyan-400 hover:text-cyan-300"
        >
          View all →
        </button>
      </div>

      {/* Scrollable Signals List */}
      <div className="max-h-[500px] overflow-y-scroll">
        {signals.map((signal) => (
          <div
            key={signal._id}
            className="flex justify-between items-center p-5 border-b border-slate-700 last:border-b-0"
          >
            <div>
              <h3 className="font-bold text-lg">
                {signal.company}
              </h3>

              <p className="text-gray-400 mt-1">
                {signal.description}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-300">
                  {signal.type}
                </span>

                <span className="text-xs text-gray-500">
                  {signal.timeAgo}
                </span>
              </div>
            </div>

            <div className="text-cyan-400 text-2xl font-bold">
              {signal.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
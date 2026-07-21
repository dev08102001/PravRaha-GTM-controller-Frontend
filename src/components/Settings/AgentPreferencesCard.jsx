 
// export default function AgentPreferencesCard({
//   preferences,
// }) {
//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//       <h2 className="text-xl font-bold mb-6">
//         🤖 Agent Preferences
//       </h2>
 
//       <div className="space-y-5">
//         {preferences?.map((item) => (
//           <div
//             key={item._id}
//             className="flex justify-between items-center"
//           >
//             <span className="text-gray-200">
//               {item.label}
//             </span>
 
//             <span
//               className={
//                 item.enabled
//                   ? "text-green-400 font-bold"
//                   : "text-red-400 font-bold"
//               }
//             >
//               {item.enabled
//                 ? "ENABLED"
//                 : "DISABLED"}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


export default function AgentPreferencesCard({
  preferences,
  settings,
  setSettings,
  role,
}) {
  const isAdmin = role === "super_admin";

  const handleToggle = (index) => {
    if (!isAdmin) return;

    const updated = [...preferences];

    updated[index] = {
      ...updated[index],
      enabled: !updated[index].enabled,
    };

    setSettings({
      ...settings,
      preferences: updated,
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        🤖 Agent Preferences
      </h2>

      <div className="space-y-5">
        {preferences?.map((item, index) => (
          <div
            key={item._id || index}
            className="flex justify-between items-center"
          >
            <span className="text-gray-200">
              {item.label}
            </span>

            {isAdmin ? (
              <button
                onClick={() => handleToggle(index)}
                className={
                  item.enabled
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {item.enabled
                  ? "ENABLED"
                  : "DISABLED"}
              </button>
            ) : (
              <span
                className={
                  item.enabled
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {item.enabled
                  ? "ENABLED"
                  : "DISABLED"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
 
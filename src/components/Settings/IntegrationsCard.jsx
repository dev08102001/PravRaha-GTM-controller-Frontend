 
// export default function IntegrationsCard({
//   integrations,
// }) {
//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
//       <h2 className="text-xl font-bold mb-6">
//         🔗 Integrations
//       </h2>
 
//       <div className="space-y-2">
//         {integrations?.map((item) => (
//           <div
//             key={item._id}
//             className="flex justify-between items-center py-4 border-b border-slate-700"
//           >
//             <div>
//               <h3 className="font-semibold text-white">
//                 {item.name}
//               </h3>
 
//               <p className="text-sm text-gray-400">
//                 {item.desc}
//               </p>
//             </div>
 
//             <span
//               className={`px-3 py-1 rounded-lg text-xs font-bold ${
//                 item.status === "CONNECTED"
//                   ? "bg-green-500/20 text-green-400"
//                   : "bg-gray-500/20 text-gray-400"
//               }`}
//             >
//               {item.status}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



export default function IntegrationsCard({
  integrations = [],
  settings,
  setSettings,
  role,
}) {
  const canEdit =
    role === "admin" ||
    role === "manager" ||
    role === "user";

  const handleToggle = (
    integrationName
  ) => {
    if (!canEdit) return;

    const updatedIntegrations =
      (settings?.integrations || []).map(
        (integration) => {
          if (
            integration.name !==
            integrationName
          ) {
            return integration;
          }

          return {
            ...integration,
            status:
              integration.status ===
              "CONNECTED"
                ? "DISCONNECTED"
                : "CONNECTED",
          };
        }
      );

    setSettings((prev) => ({
      ...prev,
      integrations:
        updatedIntegrations,
    }));
  };

  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6">
        🔗 Integrations
      </h2>

      <div className="space-y-2">
        {integrations.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center py-4 border-b border-slate-700"
          >
            <div>
              <h3 className="font-semibold text-white">
                {item.name}
              </h3>

              <p className="text-sm text-gray-400">
                {item.desc}
              </p>
            </div>

            {canEdit ? (
              <button
                onClick={() =>
                  handleToggle(
                    item.name
                  )
                }
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  item.status ===
                  "CONNECTED"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {item.status}
              </button>
            ) : (
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  item.status ===
                  "CONNECTED"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
 
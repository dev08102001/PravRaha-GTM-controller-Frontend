// export default function SignalsTable({ signalData }) {
//   return (
//     <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] rounded-2xl p-6 border border-slate-700 overflow-auto">
//       <h2 className="text-xl font-bold mb-6">Top Converting Signals</h2>
 
//       <table className="w-full">
//         <thead>
//           <tr className="text-left text-gray-400 border-b border-gray-700">
//             <th className="pb-4">Signal Type</th>
//             <th className="pb-4">Detected</th>
//             <th className="pb-4">Outreach</th>
//             <th className="pb-4">Replies</th>
//             <th className="pb-4">Meetings</th>
//             <th className="pb-4">Conv. Rate</th>
//           </tr>
//         </thead>
 
//         <tbody>
//           {signalData?.map((signal, idx) => (
//             <tr key={signal?.type ?? idx} className="border-b border-gray-800">
//               <td className="py-4 font-medium">{signal.type}</td>
//               <td>{signal.detected}</td>
//               <td>{signal.outreach}</td>
//               <td className="text-green-400">{signal.replies}</td>
//               <td className="text-pink-400">{signal.meetings}</td>
//               <td className="text-yellow-400 font-semibold">{signal.rate}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
 
 
 
 
export default function SignalsTable({ signalData = [] }) {
  return (
    <div className="bg-gradient-to-br from-[#1A2340] to-[#151D2E] p-6 rounded-2xl border border-slate-700 overflow-auto">
      <h2 className="text-xl font-bold mb-6">Top Converting Signals</h2>
 
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 border-b border-gray-700">
            <th className="pb-3">Signal</th>
            <th>Detected</th>
            <th>Outreach</th>
            <th>Replies</th>
            <th>Meetings</th>
            <th>Rate</th>
          </tr>
        </thead>
 
        <tbody>
          {signalData.map((s, idx) => (
            <tr key={s.type || idx} className="border-b border-gray-800">
              <td className="py-3 font-medium">{s.type}</td>
              <td>{s.detected}</td>
              <td>{s.outreach}</td>
              <td className="text-green-400">{s.replies}</td>
              <td className="text-pink-400">{s.meetings}</td>
              <td className="text-yellow-400 font-semibold">{s.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
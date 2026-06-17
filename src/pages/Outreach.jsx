// import { useEffect, useState } from "react";
// import api from "../services/api";

// export default function Outreach() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       setLoading(true);

//       const response = await api.get("/outreach");

//       setMessages(response.data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const approveMessage = async (id) => {
//     try {
//       await api.put(`/outreach/${id}/approve`);

//       fetchMessages();
//     } catch (error) {
//       console.error(error);

//       alert("Failed to approve message");
//     }
//   };

//   const rejectMessage = async (id) => {
//     try {
//       await api.put(`/outreach/${id}/reject`);

//       fetchMessages();
//     } catch (error) {
//       console.error(error);

//       alert("Failed to reject message");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[400px]">
//         <h2 className="text-xl text-white">
//           Loading Messages...
//         </h2>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">
//             Message Approval Queue
//           </h1>

//           <p className="text-gray-400 mt-2">
//             {messages.length} messages awaiting your review before launch
//           </p>
//         </div>

//         <button className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium">
//           ✓ Approve All
//         </button>
//       </div>

//       {/* Messages */}
//       {messages.map((msg) => (
//         <div
//           key={msg._id}
//           className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-6"
//         >
//           {/* Top */}
//           <div className="flex justify-between items-start mb-5">
//             <div className="flex gap-4">
//               <div className="w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300">
//                 {msg.initials}
//               </div>

//               <div>
//                 <h2 className="font-bold text-lg">
//                   {msg.name} • {msg.role}
//                 </h2>

//                 <p className="text-gray-400 text-sm">
//                   {msg.company} • Touch Sequence
//                 </p>
//               </div>
//             </div>

//             <div className="text-right">
//               <span
//                 className={`px-3 py-1 rounded text-xs font-semibold ${
//                   msg.channel === "EMAIL"
//                     ? "bg-green-600"
//                     : "bg-blue-600"
//                 }`}
//               >
//                 {msg.channel}
//               </span>

//               <div className="text-green-400 font-bold mt-2">
//                 Score: {msg.score}
//               </div>
//             </div>
//           </div>

//           {/* Subject */}
//           <div className="mb-4">
//             <h3 className="text-gray-400 text-sm mb-2 font-semibold">
//               SUBJECT:
//             </h3>

//             <div className="font-semibold tracking-wide">
//               {msg.subject}
//             </div>
//           </div>

//           {/* Body */}
//           <div className="bg-[#1C2538] p-5 rounded-lg whitespace-pre-line leading-8 text-gray-200">
//             {msg.body}
//           </div>

//           {/* Context */}
//           <div className="mt-4 text-green-400 italic">
//             Signal Context: {msg.context}
//           </div>

//           {/* Status */}
//           <div className="mt-4">
//             <span
//               className={`px-3 py-1 rounded text-xs font-semibold ${
//                 msg.status === "APPROVED"
//                   ? "bg-green-500/20 text-green-400"
//                   : msg.status === "REJECTED"
//                   ? "bg-red-500/20 text-red-400"
//                   : msg.status === "SENT"
//                   ? "bg-cyan-500/20 text-cyan-400"
//                   : "bg-yellow-500/20 text-yellow-400"
//               }`}
//             >
//               {msg.status || "PENDING"}
//             </span>
//           </div>

//           {/* Actions */}
//           <div className="flex flex-wrap gap-3 mt-6">
//             <button
//               onClick={() => rejectMessage(msg._id)}
//               className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10"
//             >
//               ✕ Reject
//             </button>

//             <button className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700">
//               ✎ Edit
//             </button>

//             <button
//               onClick={() => approveMessage(msg._id)}
//               className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
//             >
//               ✓ Approve & Send
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import api from "../services/api";

export default function Outreach() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/outreach");

      setMessages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const approveMessage = async (id) => {
    try {
      await api.put(`/outreach/${id}/approve`);

      fetchMessages();
    } catch (error) {
      console.error(error);

      alert("Failed to approve message");
    }
  };

  const rejectMessage = async (id) => {
    try {
      await api.put(`/outreach/${id}/reject`);

      fetchMessages();
    } catch (error) {
      console.error(error);

      alert("Failed to reject message");
    }
  };

  const approveAllMessages = async () => {
    try {
      for (const msg of messages) {
        if (msg.status !== "APPROVED") {
          await api.put(`/outreach/${msg._id}/approve`);
        }
      }

      fetchMessages();
    } catch (error) {
      console.error(error);
      alert("Failed to approve all messages");
    }
  };

  const editMessage = (msg) => {
    alert(`Edit message for ${msg.name}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <h2 className="text-xl text-white">
          Loading Messages...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Message Approval Queue
          </h1>

          <p className="text-gray-400 mt-2">
            {messages.length} messages awaiting your review before launch
          </p>
        </div>

        <button
          onClick={approveAllMessages}
          className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-medium"
        >
          ✓ Approve All
        </button>
      </div>

      {/* Messages */}
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="bg-[#151D2E] border border-[#2A3550] rounded-xl p-6"
        >
          {/* Top */}
          <div className="flex justify-between items-start mb-5">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center font-bold text-pink-300">
                {msg.initials}
              </div>

              <div>
                <h2 className="font-bold text-lg">
                  {msg.name} • {msg.role}
                </h2>

                <p className="text-gray-400 text-sm">
                  {msg.company} • Touch Sequence
                </p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  msg.channel === "EMAIL"
                    ? "bg-green-600"
                    : "bg-blue-600"
                }`}
              >
                {msg.channel}
              </span>

              <div className="text-green-400 font-bold mt-2">
                Score: {msg.score}
              </div>
            </div>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <h3 className="text-gray-400 text-sm mb-2 font-semibold">
              SUBJECT:
            </h3>

            <div className="font-semibold tracking-wide">
              {msg.subject}
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#1C2538] p-5 rounded-lg whitespace-pre-line leading-8 text-gray-200">
            {msg.body}
          </div>

          {/* Context */}
          <div className="mt-4 text-green-400 italic">
            Signal Context: {msg.context}
          </div>

          {/* Status */}
          <div className="mt-4">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold ${
                msg.status === "APPROVED"
                  ? "bg-green-500/20 text-green-400"
                  : msg.status === "REJECTED"
                  ? "bg-red-500/20 text-red-400"
                  : msg.status === "SENT"
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-yellow-500/20 text-yellow-400"
              }`}
            >
              {msg.status || "PENDING"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => rejectMessage(msg._id)}
              className="border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/10"
            >
              ✕ Reject
            </button>

            <button
              onClick={() => editMessage(msg)}
              className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              ✎ Edit
            </button>

            <button
              onClick={() => approveMessage(msg._id)}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-lg"
            >
              ✓ Approve & Send
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
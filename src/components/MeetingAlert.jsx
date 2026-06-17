// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MeetingAlert() {
//   const [alert, setAlert] = useState(null);

//   useEffect(() => {
//     fetchMeetingAlert();
//   }, []);

//   const fetchMeetingAlert = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:9077/api/meeting-alert"
//       );

//       setAlert(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (!alert) {
//     return (
//       <div className="bg-[#151D2E] rounded-2xl p-6">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl px-8 py-6 flex items-center justify-between">

//       <div className="flex items-center gap-5">

//         <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
//           🎯
//         </div>

//         <div>

//           <h3 className="font-bold text-xl text-white">
//             {alert.title}
//           </h3>

//           <p className="text-gray-300 mt-1">
//             {alert.description}
//           </p>

//         </div>

//       </div>

//       <div className="flex items-center gap-4">

//         <button className="px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition">
//           {alert.buttonText}
//         </button>

//         <button className="text-gray-400 hover:text-white text-xl">
//           ×
//         </button>

//       </div>

//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function MeetingAlert() {
//   const [alert, setAlert] = useState(null);

//   useEffect(() => {
//     fetchMeetingAlert();
//   }, []);

//   const fetchMeetingAlert = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:9077/api/meeting-alert"
//       );

//       setAlert(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleOpenBrief = () => {
//     alert("Open Brief clicked");
//   };

//   const handleClose = () => {
//     setAlert(null);
//   };

//   if (!alert) {
//     return (
//       <div className="bg-[#151D2E] rounded-2xl p-6">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl px-8 py-6 flex items-center justify-between">

//       <div className="flex items-center gap-5">

//         <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
//           🎯
//         </div>

//         <div>

//           <h3 className="font-bold text-xl text-white">
//             {alert.title}
//           </h3>

//           <p className="text-gray-300 mt-1">
//             {alert.description}
//           </p>

//         </div>

//       </div>

//       <div className="flex items-center gap-4">

//         <button
//           onClick={handleOpenBrief}
//           className="px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition"
//         >
//           {alert.buttonText}
//         </button>

//         <button
//           onClick={handleClose}
//           className="text-gray-400 hover:text-white text-xl"
//         >
//           ×
//         </button>

//       </div>

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { getMeetingAlert } from "../services/meetingService";

export default function MeetingAlert() {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMeetingAlert();
  }, []);

const fetchMeetingAlert = async () => {
  try {
    setLoading(true);
    setError(false);

    const data = await getMeetingAlert();
    setAlert(data);
  } catch (err) {
    console.error(err);
    setError(true);
  } finally {
    setLoading(false);
  }
};

  const handleOpenBrief = () => {
    // Later you can navigate to a brief page or open a modal
    console.log("Open Brief clicked");
  };

  const handleClose = () => {
    setAlert(null);
  };

  if (loading) {
    return (
      <div className="bg-[#151D2E] rounded-2xl p-6">
        Loading...
      </div>
    );
  }
  if (error) {
  return (
    <div className="bg-[#151D2E] rounded-2xl p-6 text-red-400">
      Failed to load meeting alert.
    </div>
  );
}

if (!alert) {
  return (
    <div className="bg-[#151D2E] rounded-2xl p-6 text-gray-400">
      No meeting alerts available.
    </div>
  );
}

  return (
    <div className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl px-8 py-6 flex items-center justify-between">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl">
          🎯
        </div>

        <div>
          <h3 className="font-bold text-xl text-white">
            {alert.title}
          </h3>

          <p className="text-gray-300 mt-1">
            {alert.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleOpenBrief}
          className="px-5 py-2 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-500/30 transition"
        >
          {alert.buttonText}
        </button>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}






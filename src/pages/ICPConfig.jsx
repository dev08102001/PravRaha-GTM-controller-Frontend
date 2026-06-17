// import { useEffect, useState } from "react";
// import api from "../services/api";

// export default function ICPConfig() {
//   const [loading, setLoading] = useState(false);

//   const [icp, setIcp] = useState({
//     employeeRange: [],
//     revenueStage: [],
//     industries: [],
//     geographies: [],
//     decisionMakers: [],
//     influencers: [],
//     techStack: [],
//   });

//   useEffect(() => {
//     fetchICP();
//   }, []);

//   const fetchICP = async () => {
//     try {
//       const response = await api.get("/icp");

//       if (response.data?.success && response.data?.data) {
//         setIcp({
//           employeeRange:
//             response.data.data.employeeRange || [],
//           revenueStage:
//             response.data.data.revenueStage || [],
//           industries:
//             response.data.data.industries || [],
//           geographies:
//             response.data.data.geographies || [],
//           decisionMakers:
//             response.data.data.decisionMakers || [],
//           influencers:
//             response.data.data.influencers || [],
//           techStack:
//             response.data.data.techStack || [],
//         });
//       }
//     } catch (error) {
//       console.error("ICP Fetch Error:", error);
//     }
//   };

//   const saveICP = async () => {
//     try {
//       setLoading(true);

//       const response = await api.post("/icp", icp);

//       if (response.data?.success) {
//         alert("ICP Saved Successfully");
//       }
//     } catch (error) {
//       console.error("ICP Save Error:", error);

//       alert(
//         error?.response?.data?.message ||
//           "Failed to save ICP"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSelection = (field, value) => {
//     setIcp((prev) => ({
//       ...prev,
//       [field]: prev[field].includes(value)
//         ? prev[field].filter(
//             (item) => item !== value
//           )
//         : [...prev[field], value],
//     }));
//   };

//   const chipClass = (field, value) =>
//     `px-4 py-2 rounded-xl border text-sm transition cursor-pointer ${
//       icp[field]?.includes(value)
//         ? "bg-cyan-500 text-white border-cyan-500"
//         : "bg-[#24304A] border-slate-600 hover:bg-[#30405F]"
//     }`;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h1 className="text-4xl font-bold text-white">
//             ICP Configuration
//           </h1>

//           <p className="text-gray-400 mt-2">
//             Define your Ideal Customer Profile
//           </p>
//         </div>

//         <button
//           onClick={saveICP}
//           disabled={loading}
//           className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold"
//         >
//           {loading ? "Saving..." : "Save ICP"}
//         </button>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

//         {/* Employee Range */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Employee Range
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "10-50",
//               "50-200",
//               "200-500",
//               "500-1000",
//               "1000+",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "employeeRange",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "employeeRange",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Revenue Stage */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Revenue Stage
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "Pre-Seed",
//               "Seed",
//               "Series A",
//               "Series B",
//               "Series C+",
//               "Public",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "revenueStage",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "revenueStage",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Industries */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Industries
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "DevTools",
//               "Cybersecurity",
//               "HR Tech",
//               "FinTech",
//               "AI Native",
//               "MarTech",
//               "DataOps",
//               "RevOps",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "industries",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "industries",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Geography */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Geography
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "US",
//               "India",
//               "United Kingdom",
//               "UAE",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "geographies",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "geographies",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Decision Makers */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Decision Makers
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "VP Engineering",
//               "CTO",
//               "Head of DevOps",
//               "VP Sales",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "decisionMakers",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "decisionMakers",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Influencers */}
//         <div className="bg-[#151D2E] rounded-xl p-6">
//           <h2 className="text-xl font-bold mb-4">
//             Influencers
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "Platform Engineer",
//               "SRE Lead",
//               "SDR Manager",
//               "Sales Ops",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "influencers",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "influencers",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tech Stack */}
//         <div className="bg-[#151D2E] rounded-xl p-6 xl:col-span-2">
//           <h2 className="text-xl font-bold mb-4">
//             Tech Stack
//           </h2>

//           <div className="flex flex-wrap gap-3">
//             {[
//               "Apollo",
//               "Clay",
//               "HubSpot",
//               "Salesloft",
//               "ZoomInfo",
//               "Outreach",
//             ].map((item) => (
//               <button
//                 key={item}
//                 onClick={() =>
//                   toggleSelection(
//                     "techStack",
//                     item
//                   )
//                 }
//                 className={chipClass(
//                   "techStack",
//                   item
//                 )}
//               >
//                 {item}
//               </button>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import ICPSection from "../components/ICP/ICPSection";
import api from "../services/api";

export default function ICPConfig() {
  const [loading, setLoading] =
    useState(false);

  const [sections, setSections] =
    useState([]);

  const [icp, setIcp] = useState({});

  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      await Promise.all([
        fetchConfig(),
        fetchICP(),
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  /*
  ======================
  FETCH CONFIG
  ======================
  */

  const fetchConfig = async () => {
    try {
      const res =
        await api.get("/icp-config");

      if (
        res.data.success &&
        res.data.data
      ) {
        setSections(
          res.data.data.sections || []
        );
      }
    } catch (err) {
      console.error(
        "Config Error:",
        err
      );
    }
  };

  /*
  ======================
  FETCH USER ICP
  ======================
  */

  const fetchICP = async () => {
    try {
      const res =
        await api.get("/icp");

      if (
        res.data.success &&
        res.data.data
      ) {
        setIcp(res.data.data);
      }
    } catch (err) {
      console.error(
        "ICP Fetch Error:",
        err
      );
    }
  };

  /*
  ======================
  TOGGLE CHIP
  ======================
  */

  const toggleSelection = (
    field,
    value
  ) => {
    setIcp((prev) => ({
      ...prev,

      [field]: prev[
        field
      ]?.includes(value)
        ? prev[field].filter(
            (item) =>
              item !== value
          )
        : [
            ...(prev[field] || []),
            value,
          ],
    }));
  };

  /*
  ======================
  SAVE ICP
  ======================
  */

  const saveICP = async () => {
    try {
      setLoading(true);

      const payload = {};

      sections.forEach(
        (section) => {
          payload[
            section.field
          ] =
            icp[
              section.field
            ] || [];
        }
      );

      const res =
        await api.post(
          "/icp",
          payload
        );

      if (res.data.success) {
        alert(
          "ICP Saved Successfully"
        );
      }
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data
          ?.message ||
          "Save Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">
            ICP Configuration
          </h1>

          <p className="text-gray-400 mt-2">
            Define your Ideal
            Customer Profile
          </p>
        </div>

        <button
          onClick={saveICP}
          disabled={loading}
          className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl text-white font-semibold"
        >
          {loading
            ? "Saving..."
            : "Save ICP"}
        </button>
      </div>

      {/* DYNAMIC SECTIONS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {sections.map(
          (section) => (
            <ICPSection
              key={
                section.field
              }
              title={
                section.title
              }
              field={
                section.field
              }
              options={
                section.options
              }
              selectedValues={
                icp[
                  section.field
                ] || []
              }
              onToggle={
                toggleSelection
              }
            />
          )
        )}

      </div>
    </div>
  );
}
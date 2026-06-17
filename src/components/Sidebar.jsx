// import { Link, useLocation, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/login");
//   };

//   const sections = [
//     {
//       title: "CORE PLATFORM",
//       items: [
//         { name: "Dashboard", path: "/dashboard" },
//         { name: "Campaigns", path: "/campaigns", badge: 3 },
//         { name: "Pipeline", path: "/pipeline" },
//         { name: "Outreach Queue", path: "/outreach", badge: 7 },
//         { name: "Agent Monitor", path: "/agents", badge: 4 },
//       ],
//     },
//     {
//       title: "INTELLIGENCE",
//       items: [
//         { name: "Signal Feed", path: "/signals", badge: 12 },
//         { name: "Analytics", path: "/analytics" },
//       ],
//     },
//     {
//       title: "CONFIGURATION",
//       items: [
//         { name: "ICP Config", path: "/icp" },
//         { name: "Settings", path: "/settings" },
//       ],
//     },
//   ];

//   return (
//     <aside className="w-72 min-h-screen bg-[#0E1422] border-r border-gray-800 text-white flex flex-col">

//       {/* Logo */}
//       <div className="p-6 border-b border-gray-800">
//         <div className="flex items-center gap-3">

//           <img
//             src={logo}
//             alt="PravRaha Logo"
//             className="w-10 h-10 object-contain"
//           />

//           <h1 className="text-3xl font-bold text-[#D4AE6A]">
//             PravRaha
//           </h1>

//         </div>
//       </div>

//       {/* Navigation */}
//       <div className="flex-1 overflow-y-auto px-4 py-5">

//         {sections.map((section) => (
//           <div key={section.title} className="mb-6">

//             <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-3 px-2">
//               {section.title}
//             </div>

//             <div className="space-y-1">

//               {section.items.map((item) => {
//                 const active = location.pathname === item.path;

//                 return (
//                   <Link
//                     key={item.path}
//                     to={item.path}
//                     className={`flex items-center justify-between px-3 py-3 rounded-lg transition ${
//                       active
//                         ? "bg-red-500 text-white"
//                         : "hover:bg-[#151D2E] text-gray-300"
//                     }`}
//                   >
//                     <span>{item.name}</span>

//                     {item.badge && (
//                       <span
//                         className={`text-xs px-2 py-1 rounded-full ${
//                           active
//                             ? "bg-white/20"
//                             : "bg-[#1C2538]"
//                         }`}
//                       >
//                         {item.badge}
//                       </span>
//                     )}
//                   </Link>
//                 );
//               })}

//             </div>

//           </div>
//         ))}

//       </div>

//       {/* Agent Status */}
//       <div className="px-4 pb-4">

//         <div className="bg-[#151D2E] rounded-xl p-4 border border-gray-800">

//           <div className="flex items-center justify-between">

//             <div>
//               <div className="text-sm font-medium">
//                 Agents Running
//               </div>

//               <div className="text-xs text-gray-400">
//                 Active AI Workers
//               </div>
//             </div>

//             <div className="text-green-400 font-bold">
//               4
//             </div>

//           </div>

//         </div>

//       </div>

//       {/* User */}
//       <div className="p-4 border-t border-gray-800">

//         <div className="font-medium">
//           Pankaj Kumar
//         </div>

//         <div className="text-xs text-gray-400 mb-4">
//           CEO & Founder
//         </div>

//         <button
//           onClick={handleLogout}
//           className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-medium transition"
//         >
//           Logout
//         </button>

//       </div>

//     </aside>
//   );
// }










import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import useAgents from "../hooks/queries/useAgents";
 
// const user = JSON.parse(localStorage.getItem("user"));
 
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
 
  const { data: agents = [] } = useAgents();
  const user = JSON.parse(localStorage.getItem("user"));
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
 
    navigate("/login");
  };
 
  const sections = [
    {
      title: "CORE PLATFORM",
      items: [
        { name: "Dashboard", path: "/dashboard" },
        { name: "Campaigns", path: "/campaigns", badge: 3 },
        { name: "Pipeline", path: "/pipeline" },
        { name: "Outreach Queue", path: "/outreach", badge: 7 },
        { name: "Agent Monitor", path: "/agents", badge: 4 },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { name: "Signal Feed", path: "/signals", badge: 12 },
        { name: "Analytics", path: "/analytics" },
      ],
    },
    {
      title: "CONFIGURATION",
      items: [
        { name: "ICP Config", path: "/icp" },
        { name: "Settings", path: "/settings" },
      ],
    },
  ];
 
  return (
    <aside className="w-72 min-h-screen bg-[#0E1422] border-r border-gray-800 text-white flex flex-col">
 
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
 
          <img
            src={logo}
            alt="PravRaha Logo"
            className="w-10 h-10 object-contain"
          />
 
          <h1 className="text-3xl font-bold text-[#D4AE6A]">
            PravRaha
          </h1>
 
        </div>
      </div>
 
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
 
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
 
            <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-3 px-2">
              {section.title}
            </div>
 
            <div className="space-y-1">
 
              {section.items.map((item) => {
                const active = location.pathname === item.path;
 
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-3 rounded-lg transition ${active
                        ? "bg-red-500 text-white"
                        : "hover:bg-[#151D2E] text-gray-300"
                      }`}
                  >
                    <span>{item.name}</span>
 
                    {item.badge && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${active
                            ? "bg-white/20"
                            : "bg-[#1C2538]"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
 
            </div>
 
          </div>
        ))}
 
      </div>
 
      {/* Agent Status */}
      <div className="px-4 pb-4">
 
        <div className="bg-[#151D2E] rounded-xl p-4 border border-gray-800">
 
          <div className="flex items-center justify-between">
 
            <div>
              <div className="text-sm font-medium">
                Agents Running
              </div>
 
              <div className="text-xs text-gray-400">
                Active AI Workers
              </div>
            </div>
 
            <div className="text-green-400 font-bold">
              {agents.length}
            </div>
 
          </div>
 
        </div>
 
      </div>
 
      {/* User */}
 
      {/* CHANGE:
Replaced hardcoded user name.
 
  OLD:
  Pankaj Kumar
 
  NEW:
  Dynamically displays logged-in user's first and last name.
 
  Optional chaining prevents crashes if user data
  is unavailable.
 
*/}
      <div className="p-4 border-t border-gray-800">
 
        <div className="font-medium">
          {user?.firstName} {user?.lastName}
        </div>
 
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg text-white font-medium transition"
        >
          Logout
        </button>
 
      </div>
 
    </aside>
  );
}
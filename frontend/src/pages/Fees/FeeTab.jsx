// import React, { useState } from "react";
// import FeeType from "./FeeType";
// import FeeGroup from "./FeeGroup";
// import FineSetup from "./FineSetup";

// const moduleComponents = {
//   "Fee Type": <FeeType />,
//   "Fee Group": <FeeGroup />,
//   "Fine Setup": <FineSetup />,
// };

// const feeModules = Object.keys(moduleComponents);

// const FeeTab = () => {
//   const [selectedModule, setSelectedModule] = useState("Fee Type");

//   return (
//     <div className="pt-4">
//       {/* Top Tabs */}
//       <div className="p-4 flex flex-wrap justify-between space-y-2 md:space-y-0 md:space-x-4">
//         {feeModules.map((mod, idx) => (
//           <button
//             key={idx}
//             onClick={() => setSelectedModule(mod)}
//             className={`px-4 py-2 w-full md:flex-1 text-black rounded font-semibold transition duration-200 ease-in-out ${
//               selectedModule === mod
//                 ? "bg-[#143781] text-white"
//                 : "bg-[#D5DDFF] text-black bg-opacity-60 hover:bg-opacity-80"
//             }`}
//           >
//             {mod}
//           </button>
//         ))}
//       </div>

//       {/* Dynamic Component Rendering */}
//       <div className="p-4">
//         {selectedModule && moduleComponents[selectedModule]}
//       </div>
//     </div>
//   );
// };

// export default FeeTab;


import React, { useEffect, useState } from 'react';
import CreateRoute from './CreateRoute';
import RouteList from './RouteList';
import CreateVehicle from './CreateVehicle';
import VehicleList from './VehicleList';
import StopPageList from './StopPageList';
import CreateStopPage from './CreateStopPage';
import AssignVehicle from './AssignVehicle';
import AsignList from './AsignList';
import VehicleAllocation from './VehicleAllocation';
import AllocationList from './AllocationList';
import { HiPencilSquare } from "react-icons/hi2";
import { useParams } from 'react-router-dom';

const moduleDescriptions = {
    "Route Master": ["Create Route", "Route List"],
    "Vehicle Master": ["Create vehicle", "Vehicle List"],
    "StopPage": ["Create Stop Page", "Stop Page List"],
    "Vehicle Assign": ["Assign Vehicle", "Assign List"],
    "Allocation Report": ["Vehicle Allocation", "Allocation List"],
};

const subModuleComponents = {
    "Create Route": <CreateRoute />,
    "Route List": <RouteList />,
    "Create vehicle": <CreateVehicle />,
    "Vehicle List": <VehicleList />,
    "Create Stop Page": <CreateStopPage />,
    "Stop Page List": <StopPageList />,
    "Assign Vehicle": <AssignVehicle />,
    "Assign List": <AsignList />,
    "Vehicle Allocation": <VehicleAllocation />,
    "Allocation List": <AllocationList />

};

function Transportation() {

    const { name } = useParams()
    console.log(name, "name");
    // Initialize to a valid module key
    const [activeModule, setActiveModule] = useState("Route Master");
    // Initialize to a valid submodule for the default module
    const [selectedSubModule, setSelectedSubModule] = useState("Create Route");

    const handleModuleClick = (mod) => {
        setActiveModule(mod);
        // Set default submodule for the selected module
        const defaultSubModule = moduleDescriptions[mod][0]?.trim();
        setSelectedSubModule(defaultSubModule || null);
    };

    const handleSubModuleClick = (sub) => {

        setSelectedSubModule(sub.trim());
    };
    useEffect(() => {
        if (name) {
            setSelectedSubModule(name)
        }
    }, [])

    return (
        <div className="p-4">
            {/* Main Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {Object.keys(moduleDescriptions).map((mod) => (
                    <button
                        key={mod}
                        onClick={() => handleModuleClick(mod)}
                        className={`w-full px-4 py-2 text-center rounded font-semibold transition duration-200 ${activeModule === mod
                            ? 'bg-[#143781] text-white'
                            : 'bg-[#d5ddff] text-black hover:bg-opacity-80'
                            }`}
                    >
                        {mod}
                    </button>
                ))}
            </div>

            {/* Submodules */}
            {activeModule && moduleDescriptions[activeModule]?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4  border-b-2 border-[#143781]">
                    {moduleDescriptions[activeModule]
                        .filter((sub) => sub.trim())
                        .map((sub, index) => (
                            <button
                                key={sub}
                                onClick={() => handleSubModuleClick(sub)}
                                className={`px-4 py-2 text-[#143781] text-md font-bold ${selectedSubModule === sub.trim()
                                    ? ' border-b-2 border-[#143781]'
                                    : 'bg-white   '
                                    }`}
                            >
                                {/* {index === 0 ? <HiPencilSquare className="h-6 w-6 text-[#151587] mr-2" /> : <GoThreeBars />} */}
                                {sub.trim()}
                            </button>
                        ))}
                </div>
            )}

            {/* Selected Component */}
            {selectedSubModule && (
                <div className="">
                    {subModuleComponents[selectedSubModule.trim()] || (
                        <p className="text-gray-600">Component not found for this submodule.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Transportation;
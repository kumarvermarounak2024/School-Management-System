import React, { useState } from 'react';

import HostelMaster from './HostelMaster';
import HostelList from './HostelList';
import { FaList, FaPlus } from 'react-icons/fa';


function HostelMasterAndList() {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div>
            <div className="flex space-x-4 mb-4  border-b-2 border-[#143781]">
                <button
                    onClick={() => setActiveTab('create')}
                    className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${activeTab === 'create'
                        ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
                        : 'text-gray-600 hover:text-[#143781]'
                        }`}
                >
                    <FaPlus /> Hostel Master
                </button>
                <button
                    onClick={() => setActiveTab('list')}
                    className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${activeTab === 'list'
                        ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
                        : 'text-gray-600 hover:text-[#143781]'
                        }`}
                >
                    <FaList /> Hostel List
                </button>
            </div>
            <div>
                {activeTab === 'create' ? <HostelMaster /> : <HostelList />}
            </div>
        </div>
    );
}

export default HostelMasterAndList;
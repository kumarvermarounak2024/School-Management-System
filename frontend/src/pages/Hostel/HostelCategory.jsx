import React, { useState } from 'react';
import { FaPlus, FaList } from 'react-icons/fa';

import CategoryList from './CategoryList';

import AddCategory from './AddCategory';


const HostelCategory = () => {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div>
      <div className="flex space-x-4 border-b mb-4 border-[#143781]">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${activeTab === 'create'
            ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
            : 'text-gray-600 hover:text-[#143781]'
            }`}
        >
          <FaPlus /> Add Categoty
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-2 px-4 py-2 font-semibold relative ${activeTab === 'list'
            ? 'text-[#143781] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-[#143781]'
            : 'text-gray-600 hover:text-[#143781]'
            }`}
        >
          <FaList /> Categoty List
        </button>
      </div>
      <div>
        {activeTab === 'create' ? <AddCategory /> : <CategoryList />}
      </div>
    </div>
  );
};

export default HostelCategory;
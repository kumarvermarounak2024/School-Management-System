import React, { useEffect, useState } from 'react'
import AddBookCategory from './AddBookCategory';
import BookCategoryList from './BookCategoryList';
import CreateBooks from './CreateBooks';
import BookList from './BookList';
import Bookissue from './Bookissue';
import BookIssueList from './BookIssueList';
import { useParams } from 'react-router-dom';
const moduleDescriptions = {
    "Book catogary": ["Add Book Category", "Book Category List"],
    "Books": ["create Books", "Books List"],
    "Book Issue/return": ["Book Issue", "Books Issues/Return List"],

};

const subModuleComponents = {
    "Add Book Category": <AddBookCategory />,
    "Book Category List": <BookCategoryList />,
    "create Books": <CreateBooks />,
    "Books List": <BookList />,
    "Book Issue": <Bookissue />,
    "Books Issues/Return List": <BookIssueList />,


};

function Library() {

    const { name } = useParams()
    console.log(name, "name");
    // Initialize to a valid module key
    const [activeModule, setActiveModule] = useState("Book catogary");
    // Initialize to a valid submodule for the default module
    const [selectedSubModule, setSelectedSubModule] = useState("Add Book Category");

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

export default Library

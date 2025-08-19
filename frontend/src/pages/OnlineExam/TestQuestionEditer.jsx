import React from 'react';

function TestQuestionEditer({ title, value, onChange }) {
    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row rounded-lg overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-1/4 p-4 flex items-start ">
                <h2 className="text-lg font-semibold text-gray-700">{title}*</h2>
            </div>

            {/* Editor Area */}
            <div className="w-full md:w-3/4 bg-white flex flex-col border border-gray-500 rounded-lg">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center p-2 space-x-2 bg-gray-50">
                    <select className="border rounded px-2 py-1 text-sm">
                        <option>Arial</option>
                        <option>Times New Roman</option>
                        <option>Helvetica</option>
                    </select>
                    <select className="border rounded px-2 py-1 text-sm">
                        <option>14</option>
                        <option>16</option>
                        <option>18</option>
                    </select>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="font-bold">B</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="italic">I</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">
                        <span className="underline">U</span>
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded">🔗</button>
                    <button className="p-1 hover:bg-gray-200 rounded">📎</button>
                    <button className="p-1 hover:bg-gray-200 rounded">A</button>
                    <button className="p-1 hover:bg-gray-200 rounded">🎨</button>
                    <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                    <button className="p-1 hover:bg-gray-200 rounded">≡</button>
                    <button className="p-1 hover:bg-gray-200 rounded">🔢</button>
                    <button className="p-1 hover:bg-gray-200 rounded">🔤</button>
                    <button className="p-1 hover:bg-gray-200 rounded">📋</button>
                    <button className="p-1 hover:bg-gray-200 rounded">✂️</button>
                    <button className="p-1 hover:bg-gray-200 rounded">💾</button>
                    <button className="p-1 hover:bg-gray-200 rounded">🖥️</button>
                </div>

                {/* Text Area */}
                <textarea
                    className="w-full h-[200px] sm:h-[250px] md:h-[300px] p-4 resize-none outline-none"
                    placeholder="Start typing here..."
                    value={value}
                    onChange={onChange}
                ></textarea>
            </div>
        </div>
    );
}

export default TestQuestionEditer;  
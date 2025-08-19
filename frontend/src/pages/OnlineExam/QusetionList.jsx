import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const QuestionList = () => {
  const questions = [
    {
      id: 1,
      question: '',
      type: 'Descriptive',
      marks: 20,
    },
    // Add more question objects if needed
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-[#1e1e1e]">
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-blue-100 text-black">
            <tr>
              <th className="px-4 py-2 border">SL</th>
              <th className="px-4 py-2 border">Question</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Marks</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, idx) => (
              <tr key={q.id} className="bg-white border-t">
                <td className="px-4 py-2 border">{idx + 1}</td>
                <td className="px-4 py-2 border">{q.question || <span className="text-gray-400">[No content]</span>}</td>
                <td className="px-4 py-2 border">{q.type}</td>
                <td className="px-4 py-2 border">{q.marks}</td>
                <td className="px-4 py-2 border">
                  <div className="flex gap-3">
                    <Eye className="text-gray-600 hover:text-blue-600 cursor-pointer" size={18} />
                    <Pencil className="text-gray-600 hover:text-green-600 cursor-pointer" size={18} />
                    <Trash2 className="text-gray-600 hover:text-red-600 cursor-pointer" size={18} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionList;

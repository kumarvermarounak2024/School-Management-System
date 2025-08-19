import React from "react";
import { CheckCircle } from "lucide-react";

const QuestionDetails = () => {
  const questionInfo = {
    question: "Write the correct spelling of dog",
    class: "Class 1 (Section - A)",
    subject: "English",
    type: "Single Choice",
    level: "Easy",
    marks: 25.0,
  };

  const options = [
    { option: "Option 1", isCorrect: false, details: "Doog" },
    { option: "Option 2", isCorrect: false, details: "Dogg" },
    { option: "Option 3", isCorrect: false, details: "Doog" },
    { option: "Option 4", isCorrect: true, details: "Dog" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-[#1e1e1e]">
      {/* Header Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        <button className="flex items-center gap-2 border px-4 py-2 border-black bg-gray-50 text-black font-semibold rounded hover:bg-gray-200">
          ➕ Add Question
        </button>
        <button className="flex items-center gap-2 border px-4 py-2 border-black bg-gray-50 text-black font-semibold rounded hover:bg-gray-200">
          📥 Import Question
        </button>
      </div>

      {/* Tab Title */}
      <h2 className="text-blue-700 font-semibold mb-3 border-b-2 border-blue-700 inline-block">
        Questions Details
      </h2>

      {/* Question Info Table */}
      <table className="w-full border text-sm mb-8">
        <tbody>
          <tr>
            <td className="border border-black px-4 py-2 font-medium w-1/4">Question</td>
            <td className="border border-black px-4 py-2" colSpan={3}>
              {questionInfo.question}
            </td>
          </tr>
          <tr>
            <td className="border border-black px-4 py-2 font-medium">Class</td>
            <td className="border border-black px-4 py-2">{questionInfo.class}</td>
            <td className="border border-black px-4 py-2 font-medium">Subject</td>
            <td className="border border-black px-4 py-2">{questionInfo.subject}</td>
          </tr>
          <tr> 
            <td className="border border-black px-4 py-2 font-medium">Type</td>
            <td className="border border-black px-4 py-2">{questionInfo.type}</td>
            <td className="border border-black px-4 py-2 font-medium">Level</td>
            <td className="border border-black px-4 py-2">{questionInfo.level}</td>
          </tr>
          <tr>
            <td className="border border-black px-4 py-2 font-medium">Default Mark</td>
            <td className="border border-black px-4 py-2" colSpan={3}>
              {questionInfo.marks.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Answer Section */}
      <h3 className="mb-2 font-medium">Answer:</h3>
      <table className="w-full border border-black text-sm mb-8">
        <thead className="bg-blue-100 border-black border">
          <tr>
            <th className="border px-4 py-2">Option</th>
            <th className="border px-4 py-2">Correct</th>
            <th className="border px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {options.map((opt, idx) => (
            <tr key={idx} className="bg-white">
              <td className="border border-black px-4 py-2">{opt.option}</td>
              <td className="border border-black px-4 py-2 text-center">
                {opt.isCorrect ? (
                  <CheckCircle className="text-green-600 mx-auto" size={20} />
                ) : (
                  <span className="text-gray-500">••••</span>
                )}
              </td>
              <td className="border border-black px-4 py-2">{opt.details}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back Button */}
      <div className="text-center">
        <button className="px-6 py-2 border rounded text-blue-800 border-blue-800 hover:bg-blue-50 transition">
          Back
        </button>
      </div>
    </div>
  );
};

export default QuestionDetails;

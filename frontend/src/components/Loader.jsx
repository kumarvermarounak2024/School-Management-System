import React from "react";

const Loader = ({ loaderText }) => {
  return (
    <>
      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 cursor-not-allowed"
          disabled
        >{loaderText}
          <svg
            className="animate-spin h-5 w-5 "
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
            />
          </svg>
          
        </button>
      </div>
    </>
  );
};

export default Loader;

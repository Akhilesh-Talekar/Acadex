import React from "react";

const Pagination = () => {
  return (
    <div className="py-4 flex justify-between items-center text-gray-500">
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Prev</button>
      <div className="flex items-center gap-2 text-s">
        <button className="px-2 rounded-sm bg-lamaSky">1</button>
        <button className="px-2 rounded-sm ">2</button>
        <button className="px-2 rounded-sm ">3</button>
        ...
        <button className="px-2 rounded-sm ">7</button>
      </div>
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
    </div>
  );
};

export default Pagination;

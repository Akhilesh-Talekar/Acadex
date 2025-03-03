import React from "react";

const Announcement = () => {
  return (
    <div className="bg-white rounded-xl p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-gray-400 text-xs">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaSky rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Science Subject</h2>
                <span className="text-sm text-gray-400 bg-white rounded-md p-1">08-03-2025</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">A short practice test on science</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lamaPurple rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">SST Subject</h2>
                <span className="text-sm text-gray-400 bg-white rounded-md p-1">05-03-2025</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Bring India's political map tomorrow</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-[#f7f4d2] rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lost & Found</h2>
                <span className="text-sm text-gray-400 bg-white rounded-md p-1">03-03-2025</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">A blue TRYMAX found in class XI A</p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;

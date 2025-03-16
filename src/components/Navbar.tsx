"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Searchbar */}
      <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 py-1">
        <Image src={"/search.png"} alt="search" width={14} height={14} />
        <input type="text" placeholder="Search" className="rounded-full w-[200px] p-2 bg-transparent outline-none"/>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-6 w-full justify-end">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
          <Image src={"/message.png"} alt="msg" width={20} height={20} />
        </div>

        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
          <Image src={"/announcement.png"} alt="msg" width={20} height={20} />
          <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">!</div>
        </div>
        <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">Akhilesh</span>
            <span className="text-[10px] text-gray-500 text-right">Admin</span>
        </div>
        {/* <Image src={"/avatar.png"} alt="avatar" width={36} height={36} className="rounded-full cursor-pointer"/> */}
        <UserButton/>
      </div>
    </div>
  );
};

export default Navbar;

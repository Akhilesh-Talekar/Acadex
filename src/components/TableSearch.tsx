'use client';
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const TableSearch = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const value = (e.currentTarget[0] as HTMLInputElement).value

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("search", value);
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2 py-1">
      <Image src={"/search.png"} alt="search" width={14} height={14} />
      <input
        type="text"
        placeholder="Search"
        className="rounded-full w-[200px] p-2 bg-transparent outline-none"
      />
    </form>
  );
};

export default TableSearch;

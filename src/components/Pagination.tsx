'use client';
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";
import React from "react";

const Pagination = ({page, count}:{page:number, count:number}) => {
  const router = useRouter();

  const hasPrev = ITEM_PER_PAGE * (page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const changePage = (newPage:number) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${searchParams.toString()}`);
  };
  return (
    <div className="py-4 flex justify-between items-center text-gray-500">
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => changePage(page-1)} disabled={!hasPrev}>Prev</button>
      <div className="flex items-center gap-2 text-s">
        {Array.from({length:Math.ceil(count/ITEM_PER_PAGE)}, (_, i) => {
          const pageIndex = i + 1;
          return(
            <button className={`px-2 rounded-sm ${page === pageIndex ? "bg-lamaSky" : ""}`} key={pageIndex} onClick={() => changePage(pageIndex)}>{pageIndex}</button>
          )
        })}
      </div>
      <button className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => changePage(page+1)} disabled={!hasNext}>Next</button>
    </div>
  );
};

export default Pagination;

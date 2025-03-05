import React from "react";

const Table = ({columns, renderRow, data}:TableProps) => {
  return (
    <table className="w-full mt-4">
      <thead>
        <tr className="text-left text-gray-500 text-s">
            {columns.map((column, index) => (
                <th key={column.accessor} className={column.className}>{column.header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => renderRow(item))}
      </tbody>
    </table>
  );
};

export default Table;

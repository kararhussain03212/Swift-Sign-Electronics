import React from 'react';

export default function SpecificationTable({ specifications = {} }) {
  const specEntries = Object.entries(specifications);

  if (specEntries.length === 0) {
    return <p className="text-slate-500 text-sm">No specifications listed.</p>;
  }

  return (
    <div className="overflow-hidden border border-slate-200 rounded-none shadow-xs">
      <table className="w-full text-left text-sm border-collapse">
        <tbody>
          {specEntries.map(([key, value], index) => (
            <tr
              key={key}
              className={`${
                index % 2 === 0
                  ? 'bg-slate-50/55'
                  : 'bg-white'
              } border-b border-slate-100 last:border-b-0 hover:bg-slate-100/50 transition-colors`}
            >
              <td className="px-5 py-4 font-semibold text-slate-800 w-1/3 border-r border-slate-100">
                {key}
              </td>
              <td className="px-5 py-4 text-slate-600 font-medium">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

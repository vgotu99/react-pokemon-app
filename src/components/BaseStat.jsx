import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const BaseStat = ({ statName, statValue, type }) => {
  const bg = `bg-${type}`;
  const ref = useRef(null)
  
  useEffect(() => {
    const statValueRef = ref.current
    const setStatValue = statValue * (100 / 255)
    statValueRef.style.width = setStatValue + '%'
  }, [])
  

  return (
    <tr className="w-full text-zinc-200">
      <td className="sm:px-5">{statName}</td>
      <td className="px-2 sm:px-3">{statValue}</td>
      <td>
        <div className="flex items-start h-2 min-w-[10rem] bg-gray-600 rounded overflow-hidden">
          <div ref={ref} className={`h-3 ${bg}`}></div>
        </div>
      </td>
      <td className="px-2 sm:px-5">255</td>
    </tr>
  );
};

export default BaseStat;

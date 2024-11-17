import React from "react";
import { useEffect, useState } from "react";
import { Loading } from "../assets/Loading";

export const LazyImage = ({ img, name, setIsModalOpen }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    isLoading ? setOpacity("opacity-0") : setOpacity("opacity-100");
  }, [isLoading]);

  return (
    <>
      {isLoading && (
        <div className="absolute h-full z-10 w-full flex items-center justify-center">
          <Loading className={"w-12 h-12 z-50 animate-spin text-zinc-200"} />
        </div>
      )}
      <img
        onClick={setIsModalOpen ? () => setIsModalOpen(true): undefined}
        src={img}
        alt={name}
        width="100%"
        height="auto"
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        className={`object-contain h-full ${opacity} ${setIsModalOpen ? 'cursor-pointer' : ''}`}
      />
    </>
  );
};

export default LazyImage;

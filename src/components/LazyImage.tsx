import React, { useEffect, useState } from "react";
import { Loading } from "../assets/Loading";

interface LazyImageProps {
  img: string;
  name: string
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>
}
 
export const LazyImage = ({ img, name, setIsModalOpen }: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [opacity, setOpacity] = useState<string>('opacity-0');

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
        className={`object-contain h-full ${opacity} ${setIsModalOpen as unknown as boolean ? 'cursor-pointer' : ''}`}
      />
    </>
  );
};

export default LazyImage;

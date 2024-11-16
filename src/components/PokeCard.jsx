import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { LazyImage } from "./LazyImage";
import { Link } from "react-router-dom";

export const PokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    fetchPokeDetailData();
  }, []);

  const fetchPokeDetailData = async () => {
    try {
      const res = await axios.get(url);
      const pokemonData = formatPokemonData(res.data);
      setPokemon(pokemonData);
    } catch (error) {
      console.error(error);
    }
  };

  const formatPokemonData = (params) => {
    const { id, types, name } = params;
    const pokeData = {
      id,
      name,
      type: types[0].type.name,
    };
    return pokeData;
  };

  const bg = `bg-${pokemon?.type}`;
  const border = `border-${pokemon?.type}`;
  const text = `text-${pokemon?.type}`;
  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  return (
    <>
    
      {pokemon && (
        <Link
          to={`/pokemon/${name}`}
          className={`box-border rounded-lg ${border} w-[8.5rem] h-[8.5rem] z-0  bg-slate-800`}
        >
          <div className={`${text} h-[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`} >
            #{pokemon.id.toString().padStart(3, '0')} {/* padStart(글자수, '채울 값') */}
          </div>
          <div className={`w-full flex items-center justify-center`}>
            <div className={`box-border relative flex w-full h-[5.5rem] basis-auto justify-center items-center`} >
              {/* <img src={img} alt={name} width='100%' className={`object-contain h-full`} /> */}
              <LazyImage img={img} name={name} />
            </div>
          </div>
          <div className={`${bg} text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium pt-1 text-center`}>
            {pokemon.name}
          </div>
        </Link>
      )}
    </>
  );
};

export default PokeCard;

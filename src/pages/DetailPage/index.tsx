import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loading } from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "../../assets/Balance";
import { Vector } from "../../assets/Vector";
import Type from "../../components/Type";
import BaseStat from "../../components/BaseStat";
import LazyImage from "../../components/LazyImage";
import DamageModal from "../../components/DamageModal";
import { FormattedPokemonData, Next } from "../../types/FormattedPokemonData";
import {
  Ability,
  PokemonDetail,
  Sprites,
  Stat,
} from "../../types/PokemonDetails";
import { DamageRelationOfPokemonTypes } from "../../types/DamageRelationOfPokemonTypes";
import { FlavorTextEntry, PokemonDesc } from "../../types/PokemonDesc";
import { PokemonData } from "../../types/PokemonData";

interface NextAndPrevPokemonasd {
  next: Next | undefined;
  prev: Next | undefined;
}

const DetailPage = () => {
  const [pokemon, setPokemon] = useState<FormattedPokemonData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams();
  const [pokemonId, setPokemonId] = useState(params.id);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const baseUrl = `https://pokeapi.co/api/v2/pokemon`;

  useEffect(() => {
    fetchPokemonData();
    setIsLoading(true);
  }, [pokemonId]);

  const fetchPokemonData = async () => {
    const url = `${baseUrl}/${pokemonId}`;
    try {
      const { data: pokemonData } = await axios.get<PokemonDetail>(url);
      // {data} = res.data / data: pokemonData = data를 pokemonData 라는 이름으로 변경함

      if (pokemonData) {
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;
        const nextAndPrevPokemon: NextAndPrevPokemonasd =
          await getNextAndPrevPokemon(id);

        const damageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get<DamageRelationOfPokemonTypes>(
              i.type.url
            );
            return type.data.damage_relations;
          })
        );

        const formattedPokemonData: FormattedPokemonData = {
          id,
          name,
          weight: weight / 10,
          height: height / 10,
          next: nextAndPrevPokemon.next,
          prev: nextAndPrevPokemon.prev,
          abilities: formatPokemonAbilities(abilities),
          stats: formatPokemonStats(stats),
          types: types.map((type) => type.type.name),
          damageRelations: damageRelations,
          sprites: fotmatPokemonSprites(sprites),
          desc: await getPokemonDesc(id),
        };

        setPokemon(formattedPokemonData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const formatPokemonAbilities = (abilities: Ability[]) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEF,
    statSATK,
    statSDEF,
    statSPD,
  ]: Stat[]) => [
    { name: "Hit Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEF.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEF.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

  const fotmatPokemonSprites = (sprites: Sprites) => {
    const newSprites = { ...sprites };

    (Object.keys(newSprites) as (keyof typeof newSprites)[]).forEach((key) => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });

    return Object.values(newSprites) as string[];
  };

  const getPokemonDesc = async (id: number): Promise<string> => {
    const url = `${baseUrl}-species/${id}`;
    const { data: pokemonSpecies } = await axios.get<PokemonDesc>(url);

    const descriptions = filterAndFormatDesc(
      pokemonSpecies.flavor_text_entries
    );

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const filterAndFormatDesc = (
    flavorTextEntries: FlavorTextEntry[]
  ): string[] => {
    const koreanDesc = flavorTextEntries
      .filter((f) => f.language.name === "ko")
      .map((f) => f.flavor_text.replace(/\r|\n|\f/g, " "));

    return koreanDesc;
  };

  const getNextAndPrevPokemon = async (id: number) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`;

    const { data: pokemonData } = await axios.get(urlPokemon);

    const nextRes =
      pokemonData.next && (await axios.get<PokemonData>(pokemonData.next));
    const prevRes =
      pokemonData.previous &&
      (await axios.get<PokemonData>(pokemonData.previous));

    return {
      next: nextRes?.data?.results?.[0],
      prev: prevRes?.data?.results?.[0],
    };
  };

  if (isLoading) {
    return (
      <div className="absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50">
        <Loading className={"w-12 h-12 z-50 animate-spin text-slate-900"} />
      </div>
    );
  }

  if (!isLoading && !pokemon) {
    return <div>Not Found</div>;
  }

  const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types?.[0]}`;
  const text = `text-${pokemon?.types?.[0]}`;

  return (
    <>
      {pokemon && (
        <article className="flex items-center gap-1 flex-col w-full">
          <div
            className={`${bg} w-full h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
          >
            {pokemon.prev && (
              <Link
                className="absolute top-[40%] -translate-y-1/2 z-50 left-4"
                to={`/pokemon/${pokemon.prev.name}`}
                onClick={() => setPokemonId(pokemon.prev?.name)}
              >
                <LessThan className="w-5 h-8 p-1" />
              </Link>
            )}
            {pokemon.next && (
              <Link
                className="absolute top-[40%] -translate-y-1/2 z-50 right-4"
                to={`/pokemon/${pokemon.next.name}`}
                onClick={() => setPokemonId(pokemon.next?.name)}
              >
                <GreaterThan className="w-5 h-8 p-1" />
              </Link>
            )}
            <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
              <div className="absolute z-30 top-6 flex items-center w-full justify-between px-4">
                <div className="flex items-center gap-1">
                  <Link to="/">
                    <ArrowLeft className="w-6 h-8 text-zinc-200" />
                  </Link>
                  <h1 className="text-zinc-200 font-bold text-xl capitalize">
                    {pokemon.name}
                  </h1>
                </div>
                <div className="text-zinc-200 font-bold text-base">
                  #{pokemon.id.toString().padStart(3, "0")}
                </div>
              </div>
              <div className="relative h-auto max-w-[15.5rem] z-20 mt-12 -mb-16">
                <LazyImage
                  setIsModalOpen={setIsModalOpen}
                  img={img}
                  name={pokemon.name}
                />
              </div>
            </section>
            <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3 px-5 pb-4">
              <div className="flex items-center justify-center gap-4 mt-4 mb-2">
                {pokemon.types.map((type) => (
                  <Type key={type} type={type} />
                ))}
              </div>
              <h2 className={`text-base font-semibold ${text}`}>정보</h2>
              <div className="flex w-full items-center justify-between max-w-[400px] text-center mb-4">
                <div className="w-full ">
                  <h4 className="text-[.7rem] text-zinc-200">Weight</h4>
                  <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                    <Balance />
                    {pokemon.weight}kg
                  </div>
                </div>
                <div className="w-full ">
                  <h4 className="text-[.7rem] text-zinc-200">Height</h4>
                  <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                    <Vector />
                    {pokemon.height}m
                  </div>
                </div>
                <div className="w-full text-zinc-200 ">
                  <h4 className="text-[.7rem] text-zinc-200">Ability</h4>
                  {pokemon.abilities.map((ability) => (
                    <div
                      key={ability}
                      className="text-[.5rem] text-zinc-200 capitalize"
                    >
                      {ability}
                    </div>
                  ))}
                </div>
              </div>
              <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
              <div className="w-full flex justify-center mb-4">
                <table>
                  <tbody>
                    {pokemon.stats.map((stat) => (
                      <BaseStat
                        key={stat.name}
                        statName={stat.name}
                        statValue={stat.baseStat}
                        type={pokemon.types[0]}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
              <h2 className={`text-base font-semibold ${text}`}>설명</h2>
              <p className="text-md leading-4 font-sans text-zinc-200 max-w-[30rem] text-center">
                {pokemon.desc}
              </p>
              <div className="flex my-8 justify-center">
                {pokemon.sprites.map((url, index) => (
                  <LazyImage
                    key={index}
                    img={url}
                    name={`${pokemon.name}-sprite`}
                  />
                ))}
              </div>
            </section>
          </div>
          {isModalOpen && (
            <DamageModal
              setIsModalOpen={setIsModalOpen}
              damages={pokemon.damageRelations}
            />
          )}
        </article>
      )}
    </>
  );
};

export default DetailPage;

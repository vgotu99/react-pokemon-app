import axios from "axios";
import { useEffect, useState } from "react";
import PokeCard from "../../components/PokeCard";
import AutoComplete from "../../components/AutoComplete";
import { PokemonData, PokemonNameAndUrl } from "../../types/PokemonData";

function MainPage() {
  const [allPokemons, setAllPokemons] = useState<PokemonNameAndUrl[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<PokemonNameAndUrl[]>([]);

  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  useEffect(() => {
    fetchPokeData();
  }, []);

  const filterDisplayedPokemonData = (
    allPokemonsData: PokemonNameAndUrl[],
    displayedPokemons: PokemonNameAndUrl[] = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    const array = allPokemonsData.filter(
      (_, index) => index + 1 <= limit
    );
    return array;
  };

  const fetchPokeData = async () => {
    try {
      const res = await axios.get<PokemonData>(url);
      setAllPokemons(res.data.results);
      setDisplayedPokemons(filterDisplayedPokemonData(res.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="hidden">
        <div className="text-normal bg-normal "></div>
        <div className="text-fire bg-fire "></div>
        <div className="text-water bg-water "></div>
        <div className="text-electric bg-electric "></div>
        <div className="text-grass bg-grass "></div>
        <div className="text-ice bg-ice "></div>
        <div className="text-fighting bg-fighting "></div>
        <div className="text-poison bg-poison "></div>
        <div className="text-ground bg-ground "></div>
        <div className="text-flying bg-flying "></div>
        <div className="text-psychic bg-psychic "></div>
        <div className="text-bug bg-bug "></div>
        <div className="text-rock bg-rock "></div>
        <div className="text-ghost bg-ghost "></div>
        <div className="text-dragon bg-dragon "></div>
        <div className="text-dark bg-dark "></div>
        <div className="text-steel bg-steel "></div>
        <div className="text-fairy bg-fairy"></div>
        <div className="text-none bg-none"></div>
      </div>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          <AutoComplete
            allPokemons={allPokemons}
            setDisplayedPokemons={setDisplayedPokemons}
          />
        </header>
        <section className="pt-6 flex flex-col items-center justify-center overflow-auto z-0">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-center px-2 max-w-4xl">
            {displayedPokemons.length > 0 ? (
              displayedPokemons.map(({ url, name }: PokemonNameAndUrl) => (
                <PokeCard key={url} url={url} name={name} />
              ))
            ) : (
              <h2 className="font-medium text-lg text-slate-900 mb-1">
                포켓몬이 없습니다.
              </h2>
            )}
          </div>
        </section>
        <div className="text-center">
          {allPokemons.length > displayedPokemons.length &&
            displayedPokemons.length !== 1 && (
              <button
                onClick={() =>
                  setDisplayedPokemons(
                    filterDisplayedPokemonData(allPokemons, displayedPokemons)
                  )
                }
                className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
              >
                더 보기
              </button>
            )}
        </div>
      </article>
    </>
  );
}

export default MainPage;

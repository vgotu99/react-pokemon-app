import axios from "axios";
import { useEffect, useState } from "react";
import PokeCard from "./components/PokeCard";
import { useDebounce } from "./hooks/useDebounce";

function App() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [displayedPokemons, setDisplayedPokemons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const limitNum = 20;
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  useEffect(() => {
    fetchPokeData();
  }, []);

  useEffect(() => {
    handleSearchInput(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayedPokemons = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    const array = allPokemonsData.filter(
      (pokemon, index) => index + 1 <= limit
    );
    return array;
  };

  const fetchPokeData = async () => {
    try {
      const res = await axios.get(url);
      setAllPokemons(res.data.results);
      setDisplayedPokemons(filterDisplayedPokemonData(res.data.results));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchInput = async (debouncedSearchTerm) => {
    if (searchTerm.length > 0) {
      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${debouncedSearchTerm}`
        );
        const pokemonData = {
          url: `https://pokeapi.co/api/v2/pokemon/${res.data.id}`,
          name: debouncedSearchTerm,
        };
        setDisplayedPokemons([pokemonData]);
      } catch (error) {
        setDisplayedPokemons([]);
        console.error(error);
      }
    } else {
      fetchPokeData(true);
    }
  };

  return (
    <>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          <div className="relative z-50">
            <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs w-[20.5rem] h-6 px-2 py-1 rounded-lg text-gray-300 text-center bg-[hsl(214,13%,47%)]"
              />
              <button
                type="submit"
                className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
              >
                검색
              </button>
            </form>
          </div>
        </header>
        <section className="pt-6 flex flex-col items-center justify-center overflow-auto z-0">
          <div className="flex flex-row flex-wrap gap-4 items-center justify-center px-2 max-w-4xl">
            {displayedPokemons.length > 0 ? (
              displayedPokemons.map(({ url, name }, index) => (
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

export default App;

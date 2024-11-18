import { useState } from "react";
import { useEffect } from "react";
import Type from "./Type";
import { DamageRelations as ImportedDamageRelations } from "../types/DamageRelationOfPokemonTypes";
import { Damage, DamageFromAndTo, SeparateDamageRelations } from "../types/SeparateDamageRelations";

interface DamageRelationsProps {
  damages: ImportedDamageRelations[]
}

interface Value {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageRelationsProps) => {
  const [pokemonDamageForm, setPokemonDamageForm] = useState<SeparateDamageRelations>();

  useEffect(() => {
    const arrayDamage = damages.map((damage) =>
      separateObjBetweenToAndFrom(damage)
    );

    if (arrayDamage.length === 2) {
      joinDamageRelations(arrayDamage);
      const joinedDamageRelations = joinDamageRelations(arrayDamage);
      setPokemonDamageForm(
        reduceDuplicateValues(postDamageValue(joinedDamageRelations.from))
      );
    } else {
      setPokemonDamageForm(postDamageValue(arrayDamage[0].from));
    }
  }, []);

  const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
    return {
      to: joinObj(props, "to"),
      from: joinObj(props, "from"),
    };
  };

  const joinObj = (props: DamageFromAndTo[], string: string ) => {
    const key = string as keyof typeof props[0]
    const firstArray = props[0][key];
    const secondArray = props[1][key];

    return Object.entries(secondArray).reduce((acc, [keyName, value]: [string, Damage]) => {
      const key = keyName as keyof typeof firstArray
      const result = firstArray[key]?.concat(value);
      return (acc = { [key]: result, ...acc });
    }, {});
  };

  const reduceDuplicateValues = (props: SeparateDamageRelations) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);

      return (acc = { [key]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering: Damage[], duplicateDamageValue: string) => {
    const initialArray: Damage[] = []

    return valueForFiltering.reduce((acc, cur) => {
      const { url, name } = cur;
      const filterAcc = acc.filter((a) => a.name !== name);

      return filterAcc.length === acc.length
        ? (acc = [cur, ...acc])
        : (acc = [
            { damageValue: duplicateDamageValue, name, url },
            ...filterAcc,
          ]);
    }, initialArray);
  };

  const postDamageValue = (props: SeparateDamageRelations): SeparateDamageRelations => {
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props
      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      const damageValueAddedValue = value.map((v: Value[]) => ({
        damageValue: valueOfKeyName[key],
        ...v,
      }));

      // const matchingKey = Object.keys(valueOfKeyName).find(
      //   (key) => key === keyName
      // );

      // const replacedKeyName = matchingKey
      //   ? valueOfKeyName[matchingKey]
      //   : keyName;

      return (acc = { [keyName]: damageValueAddedValue, ...acc });
    }, {});
  };

  const separateObjBetweenToAndFrom = (damage: ImportedDamageRelations): DamageFromAndTo => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    return { from, to };
  };

  const filterDamageRelations = (valueFilter: string, damage: ImportedDamageRelations) => {
    const filteredDamageRelations: SeparateDamageRelations = Object.entries(damage)
      .filter(([keyName, _]) => keyName.includes(valueFilter))
      .reduce((acc, [keyName, value]): SeparateDamageRelations => {
        const valueFilterDeletedKey = keyName.replace(valueFilter, "");
        return (acc = { [valueFilterDeletedKey]: value, ...acc });
      }, {});

    return filteredDamageRelations;
  };

  return (
    <div className="flex gap-2 flex-col w-full">
      {pokemonDamageForm ? (
        <>
          {Object.entries(pokemonDamageForm).map(([keyName, value]: [string, Damage[]]) => {
            const key = keyName as keyof typeof pokemonDamageForm
            const valuesOfKey = {
              double_damage: "Weak",
              half_damage: "Resistant",
              no_damage: "Immune",
            };
            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valuesOfKey[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map((v) => (
                      <Type
                        key={v.url}
                        type={v.name}
                        damageValue={v.damageValue}
                      />
                    ))
                  ) : (
                    <Type key={"none"} type={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;

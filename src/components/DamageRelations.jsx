import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Type from "./Type";

const DamageRelations = ({ damages }) => {
  const [pokemonDamageForm, setPokemonDamageForm] = useState();
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

  const joinDamageRelations = (props) => {
    return {
      to: joinObj(props, "to"),
      from: joinObj(props, "from"),
    };
  };

  const joinObj = (props, string) => {
    const firstArray = props[0][string];
    const secondArray = props[1][string];

    return Object.entries(secondArray).reduce((acc, [key, value]) => {
      const result = firstArray[key].concat(value);
      return (acc = { [key]: result, ...acc });
    }, {});
  };

  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    return Object.entries(props).reduce((acc, [key, value]) => {
      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);

      return (acc = { [key]: verifiedValue, ...acc });
    }, {});
  };

  const filterForUniqueValues = (valueForFiltering, duplicateDamageValue) => {
    return valueForFiltering.reduce((acc, cur) => {
      const { url, name } = cur;
      const filterAcc = acc.filter((a) => a.name !== name);

      return filterAcc.length === acc.length
        ? (acc = [cur, ...acc])
        : (acc = [
            { damageValue: duplicateDamageValue, name, url },
            ...filterAcc,
          ]);
    }, []);
  };

  const postDamageValue = (props) => {
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const valueOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };
      const damageValueAddedValue = value.map((v) => ({
        damageValue: valueOfKeyName[keyName],
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

  const separateObjBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    return { from, to };
  };

  const filterDamageRelations = (valueFilter, damage) => {
    const filteredDamageRelations = Object.entries(damage)
      .filter(([keyName, value]) => keyName.includes(valueFilter))
      .reduce((acc, [keyName, value]) => {
        const valueFilterDeletedKey = keyName.replace(valueFilter, "");
        return (acc = { [valueFilterDeletedKey]: value, ...acc });
      }, {});

    return filteredDamageRelations;
  };

  return (
    <div className="flex gap-2 flex-col">
      {pokemonDamageForm ? (
        <>
          {Object.entries(pokemonDamageForm).map(([key, value]) => {
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

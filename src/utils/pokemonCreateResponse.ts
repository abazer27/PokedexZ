import { BaseRecord } from "@refinedev/core";
import { MyPokemon } from "../interfaces/myPokemonData";

export interface pokemonCreateResponse extends BaseRecord{
  pokemon: MyPokemon,
}
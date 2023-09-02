import { DataProvider } from "@refinedev/core";
import dataProvider, { generateFilter, generateSort, stringify } from "@refinedev/simple-rest";
import { AxiosInstance } from "axios";
import { pokemonCreateResponse } from "./pokemonCreateResponse";
import { Pokemon } from "../interfaces/pokemonData";
import { MyPokemon } from "../interfaces/myPokemonData";
export const customDataProvider = (apiUrl: string, httpClient: AxiosInstance): DataProvider => {

  return {
    ...dataProvider(apiUrl, httpClient),
    getList: async ({ resource, pagination, filters, sorters, meta }) => {
      const url = `${apiUrl}/${resource}`;
      const {
        current = 1,
        pageSize = 10,
        mode = "server",
      } = pagination ?? {};

      const { headers: headersFromMeta } = meta ?? {};
      const requestMethod = "get";

      const queryFilters = generateFilter(filters);

      const query: {
        _start?: number;
        _end?: number;
        _sort?: string;
        _order?: string;
      } = {};

      if (mode === "server") {
        query._start = (current - 1) * pageSize;
        query._end = current * pageSize;
      }

      const generatedSort = generateSort(sorters);
      if (generatedSort) {
        const { _sort, _order } = generatedSort;
        query._sort = _sort.join(",");
        query._order = _order.join(",");
      }

      const { data, headers } = await httpClient[requestMethod](
        `${url}?${stringify(query)}&${stringify(queryFilters)}`,
        {
          headers: headersFromMeta,
        },
      );
      const total = +headers["x-total-count"];

      return {
        data,
        total: total || data.length,
      };
    },
    custom: async ({
      url,
      method,
      filters,
      sorters,
      payload,
      query,
      headers,
    }) => {
      let requestUrl = `${url}?`;

      if (sorters) {
        const generatedSort = generateSort(sorters);
        if (generatedSort) {
          const { _sort, _order } = generatedSort;
          const sortQuery = {
            _sort: _sort.join(","),
            _order: _order.join(","),
          };
          requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
        }
      }

      if (filters) {
        const filterQuery = generateFilter(filters);
        requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
      }

      if (query) {
        requestUrl = `${requestUrl}&${stringify(query)}`;
      }

      if (headers) {
        httpClient.defaults.headers = {
          ...httpClient.defaults.headers,
          ...headers,
        };
      }

      let axiosResponse;
      switch (method) {
        case "put":
        case "post":
        case "patch":
          axiosResponse = await httpClient[method](url, payload);
          break;
        case "delete":
          axiosResponse = await httpClient.delete(url, {
            data: payload,
          });
          break;
        default:
          axiosResponse = await httpClient.get(requestUrl);
          break;
      }
      let { data } = axiosResponse;
      const pokemonList: Pokemon[] = []
      if(Array.isArray(data?.results)) {
        const pokemons = data?.results.map(
          (pokemon: { name: string, url: string }) => pokemon?.url
          )
          if (pokemons) {
          for (const url of pokemons) {
            axiosResponse = await httpClient.get(url)
            pokemonList.push(axiosResponse.data)
          }
          data = pokemonList
        }
      }
      else{
        pokemonList.push(axiosResponse.data)
        data = pokemonList
      }
      console.log(data)
      return Promise.resolve({ data });
    },
    getOne: async ({ resource, id, meta }) => {
      const url = `${apiUrl}/${resource}/${id}`;
      const { headers } = meta ?? {};
      const { data } = await httpClient.get(url, { headers });

      return {
        data,
      };
    },
    create: async ({ resource, variables, meta }) => {
      localStorage.setItem(resource, JSON.stringify(variables))
      const { data } : pokemonCreateResponse = {
        pokemon: variables as MyPokemon,
      }
      return {
        data,
      };
    },
    // update: async ({ resource, id, variables, meta }) => {
    //   const url = `${apiUrl}/${resource}/${id}`;

    //   const { headers, method } = meta ?? {};
    //   const requestMethod = (method as MethodTypesWithBody) ?? "patch";

    //   const { data } = await httpClient[requestMethod](url, variables, {
    //     headers,
    //   });

    //   return {
    //     data,
    //   };
    // },
    // deleteOne: async ({ resource, id, variables, meta }) => {
    //   const url = `${apiUrl}/${resource}/${id}`;

    //   const { headers, method } = meta ?? {};
    //   const requestMethod = (method as MethodTypesWithBody) ?? "delete";

    //   const { data } = await httpClient[requestMethod](url, {
    //     data: variables,
    //     headers,
    //   });

    //   return {
    //     data,
    //   };
    // },
  }
}

import { Refine, TitleProps } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  RefineThemes,
  ThemedLayoutV2,
  ThemedSiderV2,
  ThemedTitleV2,
} from "@refinedev/chakra-ui";

import { ChakraProvider } from "@chakra-ui/react";
import routerBindings, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { axiosInstance } from "@refinedev/simple-rest";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { Header } from "./components/header";
import  { PokemonDetails, PokemonList } from "./pages/pokemon";
import { customDataProvider } from "./utils/customDataProvider";
import { MyPokemonDetails, MyPokemonList } from "./pages/myPokemon";
import { AppIcon } from "./components";

function App() {
  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  const ThemeLayoutTitle = ({collapsed} : TitleProps) => (
    <ThemedTitleV2 collapsed= {collapsed} text="Pokedex Maister" icon= {<AppIcon />} />
  )

  const ThemeSider = () => {
    return(
      <ThemedSiderV2 
      Title={ThemeLayoutTitle} 
      />
    )
  }

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        {/* You can change the theme colors here. example: theme={RefineThemes.Magenta} */}
        <ChakraProvider theme={RefineThemes.Red}>
          <Refine
            dataProvider={customDataProvider("https://pokeapi.co/api/v2", axiosInstance)}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            i18nProvider={i18nProvider}
            resources={[
              {
                name: "pokemon",
                list: "/pokemon",
                show: "/pokemon/:id",
              },
              {
                name: "myPokemon",
                list: "/myPokemon",
                create: "/mypokemon/create",
                show: "/mypokemon/show/:id",
                meta: {
                  canDelete: true,
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "dQnVgw-GAS0QJ-8x2YRs",
            }}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayoutV2 Header={() => <Header sticky />} Sider={ThemeSider}>
                    <Outlet />
                  </ThemedLayoutV2>
                }
              >
                <Route
                  index
                  element={<NavigateToResource resource="pokemon" />}
                />
                <Route path="/pokemon">
                  <Route index element={<PokemonList />} />
                  <Route path="show/:id" element={<PokemonDetails />}  />
                </Route>
                <Route path="/myPokemon">
                  <Route index element={<MyPokemonList />}/>
                  <Route path="create" />
                  <Route path="show/:id" element={<MyPokemonDetails />}/>
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ChakraProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

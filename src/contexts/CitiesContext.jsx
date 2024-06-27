// import { createContext, useEffect, useReducer, useCallback } from "react";

// // const URL = "http://localhost:9000";
// const URL = "https://udayakumars-n05.github.io/JSON-Server/db.json";

// export const CitiesContext = createContext();
// const initialState = {
//   cities: [],
//   isLoading: false,
//   currentCity: {},
//   error: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "loading":
//       return { ...state, isLoading: true };
//     case "cities/loaded":
//       return {
//         ...state,
//         isLoading: false,
//         cities: action.payload,
//       };
//     case "city/loaded":
//       return { ...state, isLoading: false, currentCity: action.payload };
//     case "city/created":
//       return {
//         ...state,
//         isLoading: false,
//         cities: [...state.cities, action.payload],
//         currentCity: action.payload,
//       };
//     case "city/deleted":
//       return {
//         state,
//         isLoading: false,
//         cities: [...state.cities.filter((city) => city.id !== action.payload)],
//         currentCity: {},
//       };
//     case "rejected":
//       return { ...state, isLoading: false, error: action.payload };
//     default:
//       throw new Error("Unknown action type");
//   }
// }
// function CitiesContextProvider({ children }) {
//   const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
//     reducer,
//     initialState
//   );

//   useEffect(function () {
//     async function getCities() {
//       dispatch({ type: "loading" });
//       try {
//         const res = await fetch(`${URL}/cities`);
//         const data = await res.json();
//         dispatch({ type: "cities/loaded", payload: data });
//       } catch (err) {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error fetching the data",
//         });
//       }
//     }
//     getCities();
//   }, []);

//   const getCity = useCallback(
//     async function getCity(id) {
//       if (Number(id) == currentCity.id) return;
//       dispatch({ type: "loading" });
//       try {
//         const res = await fetch(`${URL}/cities/${id}`);
//         const data = await res.json();
//         dispatch({ type: "city/loaded", payload: data });
//       } catch (err) {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error fetching the city.",
//         });
//       }
//     },
//     [currentCity.id]
//   );

//   async function createCity(newCity) {
//     dispatch({ type: "loading" });
//     try {
//       const res = await fetch(`${URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();
//       dispatch({ type: "city/created", payload: data });
//     } catch (err) {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error creating the city.",
//       });
//       console.error(err.message);
//     }
//   }

//   async function deleteCity(id) {
//     dispatch({ type: "loading" });
//     try {
//       await fetch(`${URL}/cities/${id}`, {
//         method: "DELETE",
//       });

//       dispatch({ type: "city/deleted", payload: id });
//     } catch (err) {
//       dispatch({
//         type: "rejected",
//         payload: "There was error deleting the city.",
//       });
//     }
//   }
//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         getCity,
//         createCity,
//         deleteCity,
//         error,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// export { CitiesContextProvider };

import { createContext, useContext, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const CitiesContext = createContext();

function CitiesContextProvider({ children }) {
  const [cities, setCities] = useLocalStorage([], "cities");
  const [currentCity, setCurrentCity] = useState({});

  function getCity(id) {
    setCurrentCity(cities.find((city) => city.id === id));
  }

  function createCity(newCity) {
    newCity.id = crypto.randomUUID();
    setCurrentCity(newCity);
    setCities((city) => [...city, newCity]);
  }

  function deleteCity(id) {
    setCities((city) => city.filter((city) => city.id !== id));
  }

  function updateCity(id, updatedData) {
    setCities((city) =>
      city.map((cityItem) => {
        if (cityItem.id === id) {
          return { ...cityItem, ...updatedData };
        }
        return cityItem;
      })
    );
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        updateCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesContextProvider, useCitiesContext };

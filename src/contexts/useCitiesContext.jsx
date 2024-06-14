import { useContext } from "react";
import { CitiesContext } from "./CitiesContext";

export function useCitiesContext() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error(
      "Trying to access context value outside the cities provider"
    );
  return context;
}

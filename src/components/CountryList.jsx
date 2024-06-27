import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import Message from "./Message";
import { useCitiesContext } from "../contexts/CitiesContext";
function CountryList() {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) return <Spinner />;
  if (!cities.length) return <Message message="No countries visited yet." />;
  //   const countries = cities.reduce((arr, city) => {
  //     if (!arr.map((i) => i.country).includes(city.country))
  //       return [...arr, { country: city.country, emoji: city.emoji }];
  //     else return arr;
  //   }, []);
  //   console.log("countries", countries);
  const countryList = [];
  cities.forEach((city) => {
    if (!countryList.map((el) => el.country).includes(city.country))
      return countryList.push({ country: city.country, emoji: city.emoji });
  });

  return (
    <ul className={styles.countryList}>
      {countryList.map((country) => (
        <CountryItem countryObj={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;

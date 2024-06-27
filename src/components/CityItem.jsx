import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCitiesContext } from "../contexts/CitiesContext";
import { ReactCountryFlag } from "react-country-flag";
import { codes } from "iso-country-codes";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCitiesContext();
  const { cityName, date, id, position } = city;

  function handleDeleteCity(e) {
    e.preventDefault();
    deleteCity(id);
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : styles.cityItem
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>
          {
            <ReactCountryFlag
              countryCode={
                codes.filter(
                  (c) => c.name.toLowerCase() === city.country.toLowerCase()
                )[0].alpha2
              }
              svg
            />
          }
        </span>
        <span className={styles.name}>{cityName}</span>
        {/* <span>{formattedDate.toDateString()}</span> */}
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;

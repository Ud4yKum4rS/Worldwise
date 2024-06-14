import styles from "./CountryItem.module.css";
import { ReactCountryFlag } from "react-country-flag";

import { codes } from "iso-country-codes";

function CountryItem({ countryObj }) {
  const { country } = countryObj;

  return (
    <li className={styles.countryItem}>
      <span>{country}</span>
      <span>
        <ReactCountryFlag
          countryCode={
            codes.filter(
              (c) => c.name.toLowerCase() === country.toLowerCase()
            )[0].alpha2
          }
          svg
        />
      </span>
    </li>
  );
}

export default CountryItem;

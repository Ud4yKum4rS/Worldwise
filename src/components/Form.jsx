import { useEffect, useState } from "react";
import { ReactCountryFlag } from "react-country-flag";
import styles from "./Form.module.css";
import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Spinner from "./Spinner.jsx";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useCitiesContext } from "../contexts/CitiesContext.jsx";
import { useNavigate } from "react-router-dom";
// export function convertToEmoji(countryCode) {
//   const codePoints = countryCode
//     .toUpperCase()
//     .split("")
//     .map((char) => 127397 + char.charCodeAt());
//   return String.fromCodePoint(...codePoints);
// }

function Form() {
  const navigate = useNavigate();
  const { createCity, isLoading } = useCitiesContext();
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [lat, lng] = useUrlPosition();
  const [geocodeisLoading, setgeocodeisLoading] = useState(false);
  const [country, setCountry] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  const [emoji, setEmoji] = useState("");

  useEffect(
    function () {
      async function fetchCityData() {
        try {
          if (!lat || !lng) return;
          setgeocodeisLoading(true);
          setGeocodingError("");
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          console.log("Rev GeoCode data", data);
          if (!data.countryCode || data.cityName)
            throw new Error("That does not seem to be a city");
          setCityName(data.city || data.locality || "");
          setCountry(data.countryName);
          setEmoji(data.countryCode);
          console.log("emoji", emoji);
        } catch (err) {
          setGeocodingError(err.message);
          console.error(err.message);
        } finally {
          setgeocodeisLoading(false);
        }
      }
      fetchCityData();
    },
    [lat, lng, emoji]
  );
  async function handleSubmit(e) {
    e.preventDefault();
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      date,
      emoji,
      notes,
      position: { lat, lng },
    };

    await createCity(newCity);
    navigate("/app/cities");
  }

  if (!lat || !lng) return <Message message="Select a city on the map!" />;
  if (geocodeisLoading) return <Spinner></Spinner>;
  if (geocodingError) return <Message message={geocodingError} />;
  return (
    <form
      form
      className={`${styles.form}  ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>
          <ReactCountryFlag countryCode={emoji} svg />
        </span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          showIcon
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="dd/MM/yyyy"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="210"
              width="500"
              viewBox="0 0 48 48"
            >
              <mask id="ipSApplication0">
                <g
                  fill="none"
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="4"
                >
                  <path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
                  <path
                    fill="#000"
                    d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
                  ></path>
                </g>
              </mask>
              <path
                fill="black"
                d="M0 0h48v48H0z"
                mask="url(#ipSApplication0)"
              ></path>
            </svg>
          }
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;

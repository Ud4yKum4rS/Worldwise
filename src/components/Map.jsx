import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Button from "./Button";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
// ///////////////
// //////////////
// ///////////////
function Map() {
  const navigate = useNavigate();
  const { cities } = useCitiesContext();
  const [position, setPosition] = useState([40, 0]);

  const {
    isLoading: isLoadingPosition,
    initialPosition,
    getPosition,
  } = useGeolocation();

  const [lat, lng] = useUrlPosition();

  // const [lat, lng] = function getInitialPosition() {
  //   let lat = 0;
  //   let lng = 0;
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     lat = latitude;
  //     lng = longitude;
  //   });
  //   return [lat, lng];
  // };
  // console.log([cities[0].position.lat, cities[0].position.lng]);

  useEffect(
    function () {
      if (lat && lng) setPosition([lat, lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (initialPosition)
        setPosition([initialPosition.lat, initialPosition.lng]);
    },
    [initialPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!initialPosition && (
        <Button type="position" onClick={() => getPosition()}>
          {isLoadingPosition ? "Loading..." : "Get your location"}
        </Button>
      )}
      <MapContainer
        center={position}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
        onClick={() => navigate("form")}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker position={city.position} key={city.id}>
              <Popup>
                {city.cityName} on {formatDate(city.date)}
              </Popup>
            </Marker>
          );
        })}
        <ChangeCenter position={position}></ChangeCenter>
        <DetectClick></DetectClick>
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}
function DetectClick() {
  const navigate = useNavigate();

  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}
export default Map;

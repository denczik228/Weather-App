import { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Map = ({ lat, lon }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const mapOptions = {
        center: { lat: lat, lng: lon },
        zoom: 10,
      };
      const map = new window.google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );
      
      const marker = new window.google.maps.Marker({
        position: { lat: lat, lng: lon },
        map: map,
        title: "You",
      });
    });
  }, [lat, lon]);

  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "500px",
      }}
    >
      {!map && <p className="text-center">Map...</p>}
    </div>
  );
};

export default Map;

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  currentWeather,
  currentWeatherByCity,
  weatherForFiveDays,
} from "./redux/slice/weatherSlice";
import Map from "./Map";

function App() {
  const dispatch = useDispatch();
  const { coordweather } = useSelector((state) => state.weather);
  const { cityweather } = useSelector((state) => state.weather);
  const { weatherforfivedays } = useSelector((state) => state.weather);

  const [city, setCity] = useState("");
  const [location, setLocation] = useState({ lat: null, lon: null });


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        dispatch(currentWeather({ lat: latitude, lon: longitude }));
      },
      (error) => {
        console.log("Error getting location:", error);
      }
    );
  }, [dispatch]);

  const submitHandler = () => {
    dispatch(currentWeatherByCity({ city }))
      .catch((error) => {
        console.log("Error:", error);
      });
    dispatch(weatherForFiveDays({ city }))
      .then(() => {
        setCity("");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-center items-center h-20 text-3xl font-bold text-white bg-blue-500">
        Current Weather
      </div>

      <div className=" px-4 flex flex-col justify-center items-center bg-gray-200 pt-2">
        <h1 className="text-center text-lg pb-2">Geoposition of Your City</h1>
        {location.lat && location.lon ? (
          <Map lat={location.lat} lon={location.lon} />
        ) : (
          <p className="text-center">Downloading data...</p>
        )}
      </div>

      <div className="flex-grow px-2 pt-6 pb-8 bg-gray-200">
        {Object.keys(coordweather).length > 0 && (
          <div className="flex flex-col items-center justify-center my-6">
            <div className="text-5xl font-bold text-red-500">
              Temperature: {Math.round(coordweather.main.temp - 273.15)}&deg;C
            </div>
            <div className="text-lg font-bold">
              Weather: {coordweather.weather[0].description}
            </div>
            <div className="text-lg font-semibold">
              {coordweather.name}, {coordweather.sys.country}
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitHandler();
          }}
          className="flex justify-center items-center my-6"
        >
          <input
            className="w-72 px-4 py-2 mr-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={`Type city's name like ${coordweather.name}`}
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Search by City
          </button>
        </form>

        {Object.keys(cityweather).length > 0 && (
          <div className="flex flex-col items-center justify-center my-6">
            <div className="text-lg font-bold">
              {cityweather.name}, {cityweather.sys.country}
            </div>
            <div className="text-lg font-semibold">
              {cityweather.weather[0].description}
            </div>
            <div className="text-lg">
              Temperature: {Math.round(cityweather.main.temp - 273.15)}
              °C
            </div>
            <div className="text-lg">
              Pressure: {cityweather.main.pressure} hPa
            </div>
            <div className="text-lg">
              Wind Speed: {cityweather.wind.speed} m
            </div>
          </div>
        )}

        {Object.keys(weatherforfivedays).length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {weatherforfivedays.list
              .reduce((uniqueDays, data) => {
                const dayOfWeek = new Intl.DateTimeFormat("en", {
                  weekday: "long",
                }).format(new Date(data.dt * 1000));

                if (!uniqueDays.some((day) => day.dayOfWeek === dayOfWeek)) {
                  uniqueDays.push({
                    dayOfWeek: dayOfWeek,
                    data: data,
                  });
                }

                return uniqueDays;
              }, [])
              .slice(0, 5)
              .map(({ dayOfWeek, data }, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-4 w-72"
                >
                  <div className="text-lg font-medium mb-2">
                    {index === 0
                      ? "Today"
                      : index === 1
                      ? "Tomorrow"
                      : dayOfWeek}
                  </div>{" "}
                  <div className="text-3xl font-bold mb-4">
                    {Math.round(data.main.temp - 273.15)}°C
                  </div>
                  <div className="text-gray-500 mb-2">
                    {data.weather[0].main}
                  </div>
                  <div className="text-gray-500">
                    {data.weather[0].description}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center">
        Made by denczik228 2023 year
      </div>
    </div>
  );
}

export default App;

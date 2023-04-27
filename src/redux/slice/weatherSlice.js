import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    coordweather: {},
    cityweather: {},
    weatherforfivedays:{},
    loading: false,
};

export const currentWeather = createAsyncThunk(
  "weather/currentWeather",
  async ({lat,lon}) => {
    try {
      //console.log({ lat, lon });
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_APPID}`
      );
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const currentWeatherByCity = createAsyncThunk(
  "weather/currentWeatherByCity",
  async ({ city }) => {
    try {
      console.log(city);
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.REACT_APP_APPID}`
      );
      //console.log({ data });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

export const weatherForFiveDays = createAsyncThunk(
  "weather/weatherForFiveDays",
  async ({ city }) => {
    try {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_APPID}`
      );
      console.log({ data });
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }
); 

export const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: {
    [currentWeather.pending]: (state) => {
      state.loading = true;
    },
    [currentWeather.fulfilled]: (state, action) => {
      state.loading = false;
      state.coordweather = action.payload;
    },
    [currentWeather.rejected]: (state) => {
      state.loading = false;
    },
    //current Weather in city
    [currentWeatherByCity.pending]: (state) => {
      state.loading = true;
    },
    [currentWeatherByCity.fulfilled]: (state, action) => {
      state.loading = false;
      state.cityweather = action.payload;
    },
    [currentWeatherByCity.rejected]: (state) => {
      state.loading = false;
    },
    //for 5 days
    [weatherForFiveDays.pending]: (state) => {
      state.loading = true;
    },
    [weatherForFiveDays.fulfilled]: (state, action) => {
      state.loading = false;
      state.weatherforfivedays = action.payload;
    },
    [weatherForFiveDays.rejected]: (state) => {
      state.loading = false;
    },
  },
});

export default weatherSlice.reducer;
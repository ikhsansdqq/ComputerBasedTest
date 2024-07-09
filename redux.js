// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

const initialState = {
  webcam: true,
};

const webcamSlice = createSlice({
  name: 'webcam',
  initialState,
  reducers: {
    turnOffWebcam: (state) => {
      state.webcam = false;
    },
    turnOnWebcam: (state) => {
      state.webcam = true;
    },
  },
});

export const { turnOffWebcam, turnOnWebcam } = webcamSlice.actions;

const store = configureStore({
  reducer: webcamSlice.reducer,
});

export default store;

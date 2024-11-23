// src/store/useReportStore.js
import { create } from "zustand";

const useReportStore = create((set) => ({
  geolocation: "",
  image: "",
  audio: null,

  // Actions to update the data
  setGeolocation: (geolocation) => set({ geolocation }),
  setImage: (image) => set({ image }),
  setAudio: (audio) => set({ audio }),
}));

export default useReportStore;

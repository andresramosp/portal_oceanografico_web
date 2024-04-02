import { create } from "zustand";

const useMapState = create((set) => ({
  viewState: {
    longitude: -3.7036,
    latitude: 40.4167,
    zoom: 4,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
  },
  mapStyle:
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",

  setViewState: (newViewState) => set({ viewState: newViewState }),
}));

export default useMapState;

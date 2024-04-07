import { create } from "zustand";

const useMapState = create((set, get) => ({
  layers: [],
  setLayers: (layers) => set({ layers }),

  viewState: {
    longitude: -3.7036,
    latitude: 36.4167,
    zoom: 6,
    maxZoom: 16,
    pitch: 0,
    bearing: 0,
  },
  mapStyle:
    "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json",

  setViewState: (newViewState) => set({ viewState: newViewState }),
  removeLayers: (optionId) => {
    let newLayers = get().layers.filter(
      (l) => l.props.userData.option.id != optionId
    );
    get().setLayers(newLayers);
  },
}));

export default useMapState;

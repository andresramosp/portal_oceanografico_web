import { create } from "zustand";

const useMapState = create((set, get) => ({
  layers: [],
  setLayers: (layers) => set({ layers: sortLayers(layers) }),

  addOrUpdateLayers: (layers) => {
    console.log(layers);
    for (let layer of layers) {
      get().removeLayer(layer.props.id);
    }
    set({ layers: sortLayers([...get().layers, ...layers]) });
  },

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
      (l) => l.props.userData.option.id !== optionId
    );
    set({ layers: sortLayers(newLayers) });
  },

  removeLayer: (layerId) => {
    let newLayers = get().layers.filter((l) => l.props.id !== layerId);
    set({ layers: sortLayers(newLayers) });
  },
}));

const sortLayers = (layers) => {
  return layers.sort(
    (a, b) => a.props.userData.zIndex - b.props.userData.zIndex
  );
};

export default useMapState;

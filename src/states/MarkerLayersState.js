import { create } from "zustand";
import { getMarkers, getData } from "../services/api/marker.service";
import useMapState from "./MapState";

export const useMarkerLayersState = create((set, get) => ({
  domains: [],

  setDomains: (domains) => set({ domains }),

  getMarkers: async () => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of get().domains) {
      const data = await getMarkers(domain);
      const featureType = data.features[0].geometry.type;

      // TODO: crear layers de markers
      // TODO: añadirle a cada marker su evento para llamar a la API /data
      // newLayers.push(marker);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    get().getLayers();
  },

  removeDomains: (optionId) => {
    let newDomains = get().domains.filter((d) => d.option.id != optionId);
    if (newDomains.length != get().domains.length) {
      get().setDomains(newDomains);
      const mapState = useMapState.getState();
      mapState.removeLayers(optionId);
    }
  },
}));

import { create } from "zustand";
import { IconLayer } from "@deck.gl/layers";
import { getMarkers } from "../services/api/marker.service";
import useMapState from "./MapState";

export const useMarkerLayersState = create((set, get) => ({
  domains: [],

  setDomains: (domains) => set({ domains }),

  getMarkers: async () => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of get().domains) {
      const data = await getMarkers(domain);

      const iconLayer = new IconLayer({
        id: "IconLayer-" + domain.id,
        data,
        dataTransform: (result) =>
          result.map((d) => {
            return { ...d, tooltip: d.name };
          }),
        getIcon: (d) => ({
          url: "/boya.png",
          width: 128,
          height: 128,
        }),
        getPosition: (d) => [d.longitude, d.latitude],
        getSize: 35,
        pickable: true,
        userData: {
          domain,
          option: domain.option,
          zIndex: 4,
        },
      });
      newLayers.push(iconLayer);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    get().getMarkers();
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

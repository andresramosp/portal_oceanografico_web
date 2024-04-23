import { create } from "zustand";
import { GeoJsonLayer } from "@deck.gl/layers";
import { getLayers } from "../services/api/geojson.service";
import useMapState from "./MapState";

export const useGeoJSONLayersState = create((set, get) => ({
  domains: [],

  setDomains: (domains) => set({ domains }),

  getLayers: async () => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of get().domains) {
      const data = await getLayers(domain);

      const geoJsonLayer = new GeoJsonLayer({
        id: "GeoJsonLayer",
        data,

        stroked: false,
        filled: true,
        pointType: "circle+text",
        pickable: true,

        getFillColor: [160, 160, 180, 200],
        getLineColor: (f) => {
          const hex = f.properties.color;
          // convert to RGB
          return hex
            ? hex.match(/[0-9a-f]{2}/g).map((x) => parseInt(x, 16))
            : [0, 0, 0];
        },
        getLineWidth: 20,
        getPointRadius: 4,
        getText: (f) => f.properties.name,
        getTextSize: 12,
      });

      newLayers.push(geoJsonLayer);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    get().getLayers();
  },

  removeDomains: (optionId) => {
    let newDomains = get().domains.filter((d) => d.option.id != optionId);
    get().setDomains(newDomains);
    const mapState = useMapState.getState();
    mapState.removeLayers(optionId);
  },
}));

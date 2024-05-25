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
        data: {
          ...data,
          features: data.features.map((f) => {
            return {
              ...f,
              tooltip: f.properties.IdadeSupe + " - " + f.properties.IdadeInfe,
            };
          }),
        },
        stroked: false,
        filled: true,
        pickable: true,
        getFillColor: (f) => [
          f.properties.Red,
          f.properties.Green,
          f.properties.Blue,
          200,
        ],
        getLineWidth: 20,
        getPointRadius: 4,
        userData: {
          option: domain.option,
          zIndex: 3,
        },
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
    if (newDomains.length != get().domains.length) {
      get().setDomains(newDomains);
      const mapState = useMapState.getState();
      mapState.removeLayers(optionId);
    }
  },
}));

import { create } from "zustand";
import * as WeatherLayers from "weatherlayers-gl";
import { ClipExtension } from "@deck.gl/extensions";
import useMapState from "./MapState";
const API_BASE_URL = "http://localhost:8080";

export const useParticlesLayersState = create((set, get) => ({
  domains: [],
  variable: "currents",

  setDomains: (domains) => set({ domains }),
  setVariable: (variable) => set({ variable }),

  getLayersForTime: async (date) => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of get().domains) {
      const queryParams = new URLSearchParams({
        sourceId: domain.sourceId,
        domainId: domain.id,
        date,
        variableId: get().variable,
      });
      debugger;
      const url = "http://localhost:3000/data.png"; //`${API_BASE_URL}/api/particles/data?${queryParams.toString()}`;
      const image = await WeatherLayers.loadTextureData(url, false);
      const particleLayer = new WeatherLayers.ParticleLayer({
        id: "particle",
        image,
        // bounds: [domain.limN, domain.limE, domain.limS, domain.limW],
        bounds: [domain.limW, domain.limS, domain.limE, domain.limN],

        // extensions: [new ClipExtension()],
        // clipBounds: [-181, -85.051129, 181, 85.051129],
        imageUnscale: [-128, 127],
      });
      newLayers.push(particleLayer);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
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

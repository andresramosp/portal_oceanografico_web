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
        variableId: get().variable, // TODO: getVariables()
      });
      let response = await fetch(
        `${API_BASE_URL}/api/particles/generateImage?${queryParams}`
      );
      response = await response.json();
      const image = await WeatherLayers.loadTextureData(
        response.imageUrl,
        false
      );
      const particleLayer = new WeatherLayers.ParticleLayer({
        id: "particle",
        image,
        bounds: [domain.limW, domain.limS, domain.limE, domain.limN],
        numParticles: 5000,
        imageUnscale: [response.minValue * 20, response.maxValue * 20],
        maxAge: 25,
        width: 2,
        speedFactor: 5.5,
        userData: {
          option: domain.option,
          zIndex: 2,
        },
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

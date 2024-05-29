import { create } from "zustand";
import * as WeatherLayers from "weatherlayers-gl";
import { ClipExtension } from "@deck.gl/extensions";
import useMapState from "./MapState";
import { usePlayingState } from "./PlayingState";
import { generateImage } from "../services/api/particles.service";
import { getVariables } from "../services/variables.service";
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
      let response = await generateImage(
        date,
        domain,
        get().variable,
        getVariables(get().variable)
      );
      const image = await WeatherLayers.loadTextureData(
        response.imageUrl,
        false
      );
      const particleLayer = new WeatherLayers.ParticleLayer({
        id: "particle",
        image,
        bounds: [domain.viewW, domain.limS, domain.viewE, domain.viewN],
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

  refreshLayers: async () => {
    const { timeInterval, timeIndex } = usePlayingState.getState();
    let time = timeInterval[timeIndex];
    get().getLayersForTime(time);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    if (usePlayingState.getState().paused) {
      get().refreshLayers();
    }
  },

  removeDomains: (optionId) => {
    let newDomains = get().domains.filter((d) => d.option.id != optionId);
    if (newDomains.length != get().domains.length) {
      get().setDomains(newDomains);
      const mapState = useMapState.getState();
      mapState.removeLayers(optionId);
      if (usePlayingState.getState().paused) {
        get().refreshLayers();
      }
    }
  },
}));

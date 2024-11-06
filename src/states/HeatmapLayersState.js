import { create } from "zustand";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import PaletteService from "../services/palette.service";
import GeodesicService from "../services/geodesic.service";
import { getLayerForTime, getPalette } from "../services/api/heatmap.service";
import useMapState from "./MapState";
import { usePlayingState } from "./PlayingState";
import { getVariables } from "../services/variables.service";
import { useParticlesLayersState } from "./ParticlesLayersState";

const HISTOGRAM_THRESHOLD = 8;
const MIN_THRESHOLDS = {
  WAVE: 15,
  SEA_LEVEL: 20,
  SALINITY: 8,
  CURRENTS: 10,
  WATER_TEMP: 8,
  WIND: 8,
};

export const useHeatmapLayersState = create((set, get) => ({
  domains: [],
  variable: null,
  latLonStep: { latStep: null, lonStep: null },
  paletteMinMax: { min: null, max: null },
  paletteHistogram: [],
  paletteDistribution: [100],
  colorDomain: [0, 100],

  setDomains: (domains) => set({ domains }),
  setVariable: (variable) => set({ variable }),
  setLatLonStep: (latLonStep) => set({ latLonStep }),
  setPaletteMinMax: (paletteMinMax) => set({ paletteMinMax }),
  setPaletteHistogram: (paletteHistogram) => set({ paletteHistogram }),
  setPaletteDistribution: (paletteDistribution) => set({ paletteDistribution }),
  setColorDomain: (colorDomain) => set({ colorDomain }),

  setPalette: async () => {
    console.log("setPalette: entra");
    const { dateFrom, dateTo } = usePlayingState.getState();
    const { min, max, histogram } = await getPalette(
      get().domains,
      dateFrom,
      dateTo,
      getVariables(get().variable)
    );
    get().setPaletteMinMax({ min, max });
    console.log("setPalette, setPaletteMinMax", min, max);

    get().setPaletteHistogram(histogram);
    get().setPaletteDistribution(histogram.map((d) => d.value));

    let colorDomain = PaletteService.getColorDomain(
      get().paletteDistribution,
      HISTOGRAM_THRESHOLD,
      MIN_THRESHOLDS[get().variable.toUpperCase()]
    );
    get().setColorDomain(colorDomain);
    console.log("setPalette: termina");
  },

  getLayersForTime: async (date) => {
    console.log("getLayersForTime: entra");

    const mapState = useMapState.getState();
    let reduceOpacity = useParticlesLayersState.getState().domains.length;
    const newLayers = [];
    for (let domain of get().domains) {
      try {
        const { data, latStep, lonStep } = await getLayerForTime(
          date,
          domain,
          get().paletteMinMax.min,
          get().paletteMinMax.max,
          getVariables(get().variable)
        );
        get().setLatLonStep({ latStep, lonStep });

        const heatmapLayer = new HeatmapLayer({
          data,
          opacity: reduceOpacity ? 0.4 : 1,
          id: `heatmap-layer-${domain.id}`,
          getPosition: (d) => [d[0], d[1]],
          getWeight: (d) => d[2],
          aggregation: "MEAN",
          radiusPixels: GeodesicService.getRadiusPixel(
            get().latLonStep.latStep,
            get().latLonStep.lonStep,
            {
              viewE: domain.viewE,
              viewS: domain.viewS,
              viewN: domain.viewN,
              viewW: domain.viewW,
            }
          ),
          intensity: 1,
          colorRange: PaletteService.getColorsDistribution(
            "temperature",
            get().paletteDistribution,
            true
          ),
          colorDomain: get().colorDomain,
          userData: {
            option: domain.option,
            zIndex: 1,
          },
        });
        newLayers.push(heatmapLayer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  refreshLayers: async () => {
    await get().setPalette();
    const { timeInterval, timeIndex } = usePlayingState.getState();
    let time = timeInterval[timeIndex];
    get().getLayersForTime(time);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    // Si la reproducción ya empezó pero está en paused, cargamos el layer actual desde aquí
    if (usePlayingState.getState().paused && get().domains.length) {
      get().refreshLayers();
    }
  },

  removeDomains: (optionId) => {
    let newDomains = get().domains.filter((d) => d.option.id != optionId);
    if (newDomains.length != get().domains.length) {
      get().setDomains(newDomains);
      const mapState = useMapState.getState();
      mapState.removeLayers(optionId);
      if (usePlayingState.getState().paused && get().domains.length) {
        get().refreshLayers();
      }
    }
    if (newDomains == 0) {
      get().setVariable(null);
    }
  },
}));

window.store = useHeatmapLayersState;

import { create } from "zustand";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import PaletteService from "../services/palette.service";
import GeodesicService from "../services/geodesic.service";

const API_BASE_URL = "http://localhost:8080";
const HISTOGRAM_THRESHOLD = 8;
const MIN_THRESHOLDS = {
  WAVE: 15,
  SEA_LEVEL: 20,
  SALINITY: 8,
  CURRENTS: 10,
  WATER_TEMP: 8,
  WIND: 8,
};

export const useTimeLayersState = create((set, get) => ({
  domains: [],
  layers: [],
  variable: "salinity",
  latLonStep: { latStep: null, lonStep: null },
  paletteMinMax: { min: null, max: null },
  paletteHistogram: [],
  paletteDistribution: [100],
  colorDomain: [0, 100],

  setDomains: (domains) => set({ domains }),
  setVariable: (variable) => set({ variable }),
  setLayers: (layers) => set({ layers }),
  setLatLonStep: (latLonStep) => set({ latLonStep }),
  setPaletteMinMax: (paletteMinMax) => set({ paletteMinMax }),
  setPaletteHistogram: (paletteHistogram) => set({ paletteHistogram }),
  setPaletteDistribution: (paletteDistribution) => set({ paletteDistribution }),
  setColorDomain: (colorDomain) => set({ colorDomain }),

  // TODO: y para varios domains?
  setPalette: async () => {
    const response = await fetch(`${API_BASE_URL}/api/heatmap/palette`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceId: get().domains[0].sourceId,
        domainId: get().domains[0].id,
        from: "2024-03-21T12:00:00.000Z",
        to: "2024-03-21T12:00:00.000Z",
        variables: ["salinity"], // ¿Donde poner la variable? ¿Aqui o en los TimeLayers?
      }),
    });
    const { min, max, histogram } = await response.json();
    get().setPaletteMinMax({ min, max });
    get().setPaletteHistogram(histogram);
    get().setPaletteDistribution(histogram.map((d) => d.value));

    // Ver si sacar (antes estaba fuera)
    let colorDomain = PaletteService.getColorDomain(
      get().paletteDistribution,
      HISTOGRAM_THRESHOLD,
      MIN_THRESHOLDS[get().variable.toUpperCase()]
    );
    get().setColorDomain(colorDomain);
  },

  getLayersForTime: async (date) => {
    const newLayers = [];
    for (let domain of get().domains) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/heatmap/data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: domain.sourceId,
            domainId: domain.id,
            date,
            minValue: get().paletteMinMax.min,
            maxValue: get().paletteMinMax.max,
            variables: [get().variable],
            bounds: {
              // TODO
              viewS: null,
              viewW: null,
              viewN: null,
              viewE: null,
            },
            zoom: 8, // TODO
          }),
        });
        const { data, latStep, lonStep } = await response.json();
        get().setLatLonStep({ latStep, lonStep });
        const heatmapLayer = new HeatmapLayer({
          data: data,
          id: "heatmap-layer",
          getPosition: (d) => [d[0], d[1]],
          getWeight: (d) => d[2],
          aggregation: "MEAN",
          radiusPixels: GeodesicService.getRadiusPixel(
            get().latLonStep.latStep,
            get().latLonStep.lonStep,
            {
              limE: domain.limE,
              limS: domain.limS,
              limN: domain.limN,
              limW: domain.limW,
            }
          ),
          intensity: 1,
          colorRange: PaletteService.getColorsDistribution(
            "cirana",
            get().paletteDistribution,
            true
          ),
          colorDomain: get().colorDomain,
        });
        newLayers.push(heatmapLayer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    set({ layers: newLayers });
  },
}));

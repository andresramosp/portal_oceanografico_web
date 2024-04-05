import { create } from "zustand";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import PaletteService from "../services/palette.service";
import GeodesicService from "../services/geodesic.service";
import { getLayerForTime, getPalette } from "../services/api/heatmap.service";

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
    const { min, max, histogram } = await getPalette(
      get().domains,
      "2024-03-21T12:00:00.000Z",
      "2024-03-21T12:00:00.000Z",
      ["salinity"]
    );
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
    let newLayers = [];
    for (let domain of get().domains) {
      try {
        const { data, latStep, lonStep } = await getLayerForTime(
          date,
          domain,
          get().paletteMinMax.min,
          get().paletteMinMax.max,
          [get().variable]
        );
        get().setLatLonStep({ latStep, lonStep });

        const heatmapLayer = new HeatmapLayer({
          data: data,
          id: `heatmap-layer-${domain.id}`,
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

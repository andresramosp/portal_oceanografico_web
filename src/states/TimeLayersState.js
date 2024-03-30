import { create } from "zustand";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import PaletteService from "../services/palette.service";

const API_BASE_URL = "http://localhost:8080";

export const useTimeLayersState = create((set, get) => ({
  domains: [],
  layers: [],
  variable: "salinity",
  //   radiusPixels: 5,

  setDomains: (domains) => set({ domains }),
  setVariable: (variable) => set({ variable }),
  setLayers: (layers) => set({ layers }),

  // Sacar a un servicio especifio de calculos varios
  getRadiusPixel: () => {
    return 5;
  },

  getLayersForTime: async (date) => {
    console.log(date);
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
            minValue: 26.45,
            maxValue: 37.43,
            variables: [get().variable],
            bounds: {
              viewS: null,
              viewW: null,
              viewN: null,
              viewE: null,
            },
            zoom: 8,
          }),
        });
        const { data } = await response.json();
        const heatmapLayer = new HeatmapLayer({
          data: data,
          id: "heatmap-layer",
          getPosition: (d) => [d[0], d[1]],
          getWeight: (d) => d[2],
          aggregation: "MEAN",
          radiusPixels: get().getRadiusPixel(),
          intensity: 1,
          threshold: 0.03,
          colorRange: PaletteService.getColorsDistribution(
            "cirana",
            [100],
            true
          ),
          colorDomain: [0, 100],
        });
        newLayers.push(heatmapLayer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    set({ layers: newLayers });
  },
}));

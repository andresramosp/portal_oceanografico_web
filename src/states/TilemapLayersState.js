import { create } from "zustand";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import useMapState from "./MapState";

const API_BASE_URL = "http://localhost:8080";

export const useTilemapLayersState = create((set, get) => ({
  domains: [],
  variable: null,
  paletteUrl: "",

  setDomains: (domains) => set({ domains }),
  setVariable: (variable) => set({ variable }),
  setPaletteUrl: (paletteUrl) => set({ paletteUrl }),

  getLayersForTime: async (date) => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of get().domains) {
      const tileLayer = new TileLayer({
        id: "TileLayer",
        data: `${API_BASE_URL}/api/tilemap/tiles/${domain.url.replace(
          "{t}",
          "2024041309"
        )}`,
        maxZoom: 19,
        minZoom: 0,

        renderSubLayers: (props) => {
          const { boundingBox } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [
              boundingBox[0][0],
              boundingBox[0][1],
              boundingBox[1][0],
              boundingBox[1][1],
            ],
          });
        },
        pickable: true,
      });

      newLayers.push(tileLayer);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
  },

  removeDomains: (optionId) => {
    let newDomains = get().domains.filter((d) => d.option.id != optionId);
    get().setDomains(newDomains);
    const mapState = useMapState.getState();
    mapState.removeLayers(optionId);
  },
}));

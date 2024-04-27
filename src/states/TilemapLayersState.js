import { create } from "zustand";
import { TileLayer } from "@deck.gl/geo-layers";
import { BitmapLayer } from "@deck.gl/layers";
import useMapState from "./MapState";
import { formatDate } from "../services/api/tilemap.service";

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
      let url =
        `${API_BASE_URL}/api/tilemap/tiles/` +
        domain.url.replace("{t}", formatDate(date));
      const tileLayer = new TileLayer({
        id: `tilelayer-layer-${domain.id}`,
        data: url,
        // maxZoom: domain.zoomMax,
        // minZoom: domain.zoomMin,
        maxCacheSize: 20,
        tileSize: 256,
        userData: {
          option: domain.option,
        },
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
    if (newDomains.length != get().domains.length) {
      get().setDomains(newDomains);
      const mapState = useMapState.getState();
      mapState.removeLayers(optionId);
    }
  },
}));

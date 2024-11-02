import { create } from "zustand";
import { IconLayer } from "@deck.gl/layers";
import { getMarkers } from "../services/api/marker.service";
import useMapState from "./MapState";
import * as d3 from "d3-ease";

export const useMarkerLayersState = create((set, get) => ({
  domains: [],

  setDomains: (domains) => set({ domains }),

  getMarkers: async (newDomains) => {
    const mapState = useMapState.getState();
    let newLayers = [];
    for (let domain of newDomains) {
      let data = await getMarkers(domain);

      data = data.filter((d) => d.id == 196 || domain.sensorType == "EULERIAN");

      data = data.map((d) => {
        return {
          ...d,
          latitude: d.id == 196 ? 35.914776 : d.latitude,
          longitude: d.id == 196 ? -5.75684166 : d.longitude,
        };
      });

      const iconLayer = new IconLayer({
        id: `icon-layer-${domain.id}`,
        data,
        dataTransform: (result) =>
          result.map((d) => {
            return { ...d, tooltip: d.name };
          }),
        getIcon: (d) => ({
          url:
            domain.sensorType == "LAGRANGNIAN"
              ? "/boya_lagrangniana.png"
              : "/boya_euleriana.png",
          width: 128,
          height: 128,
        }),
        getPosition: (d) => {
          return [d.longitude, d.latitude];
        },
        // transitions:
        //   domain.sensorType == "LAGRANGNIAN"
        //     ? {
        //         getPosition: {
        //           duration: 500,
        //           easing: (d) => d3.easeCubicInOut(d),
        //         },
        //       }
        //     : undefined,
        getSize: 27,
        pickable: true,
        userData: {
          domain,
          option: domain.option,
          zIndex: 4,
          sensorType: domain.sensorType,
        },
      });
      newLayers.push(iconLayer);
    }
    mapState.addOrUpdateLayers(newLayers);
  },

  updateMarkerForPosition: (markerId, position) => {
    // Get the map state
    const mapState = useMapState.getState();
    // Get the current layers from the map state
    const layers = mapState.layers;

    let updatedLayer = null;

    // Iterate over layers to find the layer containing the marker
    for (let layer of layers) {
      // Only process IconLayers (marker layers)
      if (layer instanceof IconLayer) {
        // Get the data from the layer
        const data = layer.props.data;

        // Find the index of the marker in the data
        const markerIndex = data.findIndex((d) => d.id === markerId);

        if (markerIndex !== -1) {
          // We found the marker in this layer
          // Create a new data array with the updated position for the marker
          const newData = [...data];
          const marker = newData[markerIndex];

          // Update the position of the marker
          newData[markerIndex] = {
            ...marker,
            latitude: position.latitude,
            longitude: position.longitude,
          };

          // Get sensorType from layer's userData
          const sensorType = layer.props.userData.sensorType;

          // Create a new layer with the updated data
          updatedLayer = new IconLayer({
            ...layer.props,
            data: newData,
            transitions:
              sensorType === "LAGRANGNIAN"
                ? {
                    getPosition: {
                      duration: 750,
                      easing: (t) => d3.easeCubicInOut(t),
                    },
                  }
                : undefined,
          });

          // We found and updated the layer, so we can break out of the loop
          break;
        }
      }
    }

    if (updatedLayer) {
      // Update the layers in the map state using addOrUpdateLayers
      mapState.addOrUpdateLayers([updatedLayer]);
    }
  },

  addDomains: (newDomains) => {
    get().setDomains([...get().domains, ...newDomains]);
    get().getMarkers(newDomains);
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

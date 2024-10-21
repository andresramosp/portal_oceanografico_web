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
      const data = await getMarkers(domain);

      const iconLayer = new IconLayer({
        id: (d) => "IconLayer-" + domain.id + "-" + d.id,
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
        //           duration: 2000,
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
    // TODO: para ser llamado con el slider-mini-player para una sola boya
    // TODO: hay que pensar como se gestiona esto para un solo marker, ya que hasta ahora hemos tratado layers con varios markers
    // Quiza solo iterar como antes, pero filtrando por el id, y actualizarle la position... (SI)
    // TODO: tener en cuenta requisito de dejar visible position final, por lo que quizas seria mejor añadir un nuevo marker para la animacion?
  },

  // Usar para crear el metodo de arriba y borrar
  getMarkersForIndex: (index) => {
    const mapState = useMapState.getState();
    let updatedLayers = [];

    for (let iconLayer of get().mobileLayers) {
      // Get the existing data from the layer
      const data = iconLayer.props.data;

      // Update the position for each data point based on the new index
      const updatedData = data.map((d) => ({
        ...d,
        position: d.positions[index],
      }));

      // Create a new IconLayer with the updated data
      const updatedIconLayer = new IconLayer({
        ...iconLayer.props,
        data: updatedData,
        id: iconLayer.props.id,
        transitions: {
          getPosition: {
            duration: 2000,
            easing: (t) => d3.easeCubicInOut(t),
          },
        },
      });

      updatedLayers.push(updatedIconLayer);
    }

    // Update the layers in the map state
    mapState.addOrUpdateLayers(updatedLayers);

    // Optionally, update the mobileLayers in the store
    get().setMobileLayers(updatedLayers);
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
    // Remove corresponding mobile layers

    // const newMobileLayers = get().mobileLayers.filter(
    //   (layer) => layer.props.userData.option.id !== optionId
    // );
    // get().setMobileLayers(newMobileLayers);
  },
}));

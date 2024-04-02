import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import { useTimeLayersState } from "../states/TimeLayersState";
import useMapState from "../states/MapState";

export default function DeckGLMap() {
  const { viewState, mapStyle, setViewState } = useMapState((state) => ({
    viewState: state.viewState,
    mapStyle: state.mapStyle,
    setViewState: state.setViewState,
  }));

  const { layers: timeLayers } = useTimeLayersState((state) => ({
    layers: state.layers,
  }));

  // const { layers: featureLayers } = useFeatureLayersState((state) => ({
  //   layers: state.layers,
  // }));

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  const layers = [...timeLayers];

  return (
    <DeckGL
      initialViewState={viewState}
      onViewStateChange={onViewStateChange}
      controller={true}
      layers={layers}
    >
      <Map
        reuseMaps
        mapLib={maplibregl}
        mapStyle={mapStyle}
        preventStyleDiffing={true}
      />
    </DeckGL>
  );
}

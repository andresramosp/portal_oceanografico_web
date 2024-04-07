import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import useMapState from "../states/MapState";

export default function DeckGLMap() {
  const { viewState, mapStyle, setViewState, layers } = useMapState();

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

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

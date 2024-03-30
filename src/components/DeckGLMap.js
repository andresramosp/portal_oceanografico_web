import { useContext } from "react";
import { TimeLayersContext } from "../providers/TimeLayersContext";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";

const INITIAL_VIEW_STATE = {
  longitude: -3.7036,
  latitude: 40.4167,
  zoom: 4,
  maxZoom: 16,
  pitch: 0,
  bearing: 0,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export default function DeckGLMap({ mapStyle = MAP_STYLE }) {
  const { layers } = useContext(TimeLayersContext);

  return (
    <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
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

import { useState } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import useMapState from "../states/MapState";
import CustomTooltip from "./CustomTooltip";
import { IconLayer } from "@deck.gl/layers";
import { getData as getMarkerData } from "../services/api/marker.service";

export default function DeckGLMap() {
  const { viewState, mapStyle, setViewState, layers } = useMapState();
  const [hoverInfo, setHoverInfo] = useState(null);

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  const onClick = (info) => {
    setHoverInfo(null);
  };

  const onHover = (info) => {
    if (info.layer instanceof IconLayer && info.object) {
      let { userData } = info.layer.props;

      info.object = {
        ...info.object,
        callback: () => getMarkerData(userData.domain, info.object.id),
      };
      setHoverInfo(info);
    } else {
      // setHoverInfo(null);
    }
  };

  return (
    <div>
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={true}
        layers={layers}
        onHover={onHover} // Manejador del evento onHover
        onClick={onClick}
      >
        <Map
          reuseMaps
          mapLib={maplibregl}
          mapStyle={mapStyle}
          preventStyleDiffing={true}
        />
      </DeckGL>
      {hoverInfo && hoverInfo.object && (
        <div
          style={{
            position: "absolute",
            left: hoverInfo.x,
            top: hoverInfo.y,
          }}
        >
          <CustomTooltip data={hoverInfo.object} />
        </div>
      )}
    </div>
  );
}

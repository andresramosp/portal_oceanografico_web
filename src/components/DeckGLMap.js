import { useState, useRef, useEffect } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import useMapState from "../states/MapState";
import SensorDataTooltip from "./SensorDataTooltip";
import DownloadDialog from "./DownloadDialog";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import { SerialTimePanel } from "./SerialTimePanel";
import "maplibre-gl/dist/maplibre-gl.css";

export default function DeckGLMap() {
  const {
    viewState,
    mapStyle,
    setViewState,
    layers,
    downloadDialogVisible,
    setDownloadDialogVisible,
  } = useMapState();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [graphicMarker, setGraphicMarker] = useState(null);
  const [graphicPanelVisible, setGraphicPanelVisible] = useState(false);
  const mapContainerRef = useRef(null);

  const [containerRect, setContainerRect] = useState({});

  const handleGraphichOpen = () => {
    setGraphicPanelVisible(true);
    setGraphicMarker({ ...hoverInfo.object });
  };

  const handleDrawerClose = () => {
    setGraphicPanelVisible(false);
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      setContainerRect(mapContainerRef.current.getBoundingClientRect());
    }
  }, [mapContainerRef]);

  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  const onClick = (info) => {
    if (info.layer instanceof IconLayer && info.object) {
      let { userData } = info.layer.props;

      info.object = {
        ...info.object,
        ...userData,
      };
      setHoverInfo(info);
    }
  };

  // const getTooltipPosition = () => {
  //   if (!hoverInfo || !containerRect.width) return { left: 0, top: 0 };

  //   const padding = 10; // Espacio entre el tooltip y el borde del contenedor
  //   const tooltipWidth = 400; // Ancho estimado del tooltip
  //   const tooltipHeight = 250; // Alto estimado del tooltip

  //   let left = hoverInfo.x;
  //   let top = hoverInfo.y;

  //   if (hoverInfo.x < padding) {
  //     left = padding;
  //   }
  //   if (hoverInfo.y < padding) {
  //     top = padding;
  //   }

  //   return { left, top };
  // };

  // const tooltipPosition = getTooltipPosition();

  return (
    <div
      ref={mapContainerRef}
      style={{ position: "relative", height: "100vh" }}
    >
      <DeckGL
        initialViewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={true}
        layers={layers}
        // onHover={onHover}
        onClick={onClick}
        getTooltip={({ object }) => object && object.tooltip}
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
            left: 10,
            top: 10,
          }}
        >
          <SensorDataTooltip
            onGraphichOpen={handleGraphichOpen}
            marker={hoverInfo.object}
            onClose={() => setHoverInfo(null)}
          />
        </div>
      )}
      {graphicPanelVisible && (
        <SerialTimePanel
          marker={graphicMarker}
          handleDrawerClose={handleDrawerClose}
        />
      )}
      <DownloadDialog
        visible={downloadDialogVisible}
        marker={graphicMarker}
        onCancel={() => setDownloadDialogVisible(false)}
      />
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import useMapState from "../states/MapState";
import SensorDataTooltip from "./SensorDataTooltip";
import DownloadDialog from "./DownloadDialog";
import { GeoJsonLayer, IconLayer } from "@deck.gl/layers";
import debounce from "lodash.debounce";
import { SerialTimePanel } from "./SerialTimePanel";
import "maplibre-gl/dist/maplibre-gl.css";
import { useMarkerLayersState } from "../states/MarkerLayersState";

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
  const debouncedMarkerOutRef = useRef(null);

  const [containerRect, setContainerRect] = useState({});

  // PROVISIONAL: mover a player o similar
  // const { domains: markerDomains, getMarkersForIndex } = useMarkerLayersState();
  // const [currentIndex, setCurrentIndex] = useState(0);
  // const interval = useRef(null);

  const cancelDebounce = () => {
    if (debouncedMarkerOutRef.current) {
      debouncedMarkerOutRef.current.cancel();
      debouncedMarkerOutRef.current = null;
    }
  };

  const onTooltipMouseMove = () => {
    cancelDebounce();
  };

  const handleGraphichOpen = () => {
    setGraphicPanelVisible(true);
    setGraphicMarker({ ...hoverInfo.object });
    setHoverInfo(null);
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
    setHoverInfo(null);
  };

  const onHover = (info) => {
    if (info.layer instanceof IconLayer && info.object) {
      cancelDebounce();
      let { userData } = info.layer.props;

      info.object = {
        ...info.object,
        ...userData,
      };
      setHoverInfo(info);
    } else if (info.layer instanceof GeoJsonLayer) {
    } else if (hoverInfo) {
      cancelDebounce();
      debouncedMarkerOutRef.current = debounce(() => {
        setHoverInfo(null);
      }, 1000);
      debouncedMarkerOutRef.current();
    }
  };

  const getTooltipPosition = () => {
    if (!hoverInfo || !containerRect.width) return { left: 0, top: 0 };

    const padding = 10; // Espacio entre el tooltip y el borde del contenedor
    const tooltipWidth = 400; // Ancho estimado del tooltip
    const tooltipHeight = 250; // Alto estimado del tooltip

    let left = hoverInfo.x;
    let top = hoverInfo.y;

    if (hoverInfo.x < padding) {
      left = padding;
    }
    if (hoverInfo.y < padding) {
      top = padding;
    }

    return { left, top };
  };

  const tooltipPosition = getTooltipPosition();

  // PROVISIONAL: mover a player o similar
  // const handleMobileDomains = () => {
  //   let lagrangnianDomains = markerDomains.filter(
  //     (d) => d.sensorType == "LAGRANGNIAN"
  //   );
  //   if (lagrangnianDomains.length && !interval.current) {
  //     interval.current = setInterval(() => {
  //       setCurrentIndex((prevIndex) => (prevIndex + 1) % 5);
  //     }, 2000); // Cambiar cada 2 segundos
  //     return () => clearInterval(interval);
  //   }
  // };
  // useEffect(() => {
  //   handleMobileDomains();
  // }, [markerDomains]);

  // useEffect(() => {
  //   getMarkersForIndex(currentIndex);
  // }, [currentIndex]);

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
        onHover={onHover}
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
            left: tooltipPosition.left,
            top: tooltipPosition.top,
            // pointerEvents: "none", // Para evitar que el tooltip interfiera con otros eventos de mouse
          }}
        >
          <SensorDataTooltip
            onHover={onTooltipMouseMove}
            onGraphichOpen={handleGraphichOpen}
            marker={hoverInfo.object}
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

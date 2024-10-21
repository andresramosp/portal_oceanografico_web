import { Card, Slider, Spin } from "antd";
import "../styles/sensorPathTooltip.css";
import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { getData, getPathData } from "../services/api/marker.service";
import { useMarkerLayersState } from "../states/MarkerLayersState";
import { componentTheme } from "../themes/blueTheme";

const SensorPathDataTooltip = ({ onHover, marker }) => {
  const [apiData, setApiData] = useState([]);
  const [timeIndex, setTimeIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [positionLabel, setPositionLabel] = useState(null);
  const debouncedGetDataRef = useRef(null);

  const { updateMarkerForPosition } = useMarkerLayersState.getState();

  const { Spin: spinTheme } = componentTheme.components;

  const cancelDebounce = () => {
    if (debouncedGetDataRef.current) {
      debouncedGetDataRef.current.cancel();
      debouncedGetDataRef.current = null;
    }
  };

  const getApiPathData = async () => {
    setLoading(true);
    let result = await getPathData(marker.domain, marker.id);
    setApiData(result);
    setTimeIndex(result.length - 1);
    setLoading(false);
  };

  useEffect(() => {
    cancelDebounce();
    debouncedGetDataRef.current = debounce(() => {
      getApiPathData();
    }, 450);
    debouncedGetDataRef.current();
    return () => debouncedGetDataRef.current.cancel();
  }, []);

  const getDateString = (jsonDateStr) => {
    const date = new Date(jsonDateStr);
    return date
      .toLocaleDateString("es-ES", {
        timeZone: "UTC",
        day: "2-digit",
        year: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  const getLatLngLabel = (position) => {
    const cardinalLat = position.latitude > 0 ? "N" : "S";
    const cardinalLon = position.longitude > 0 ? "O" : "E";
    return `Lat ${position.latitude.toFixed(
      2
    )}º ${cardinalLat} Lon ${position.longitude.toFixed(2)}º ${cardinalLon}`;
  };

  // const handleSliderChange = (value) => {
  //   updateMarkerForIndex(value);

  //   let position = apiData[value];
  //   setPositionLabel(
  //     getDateString(position.positionDateTime) +
  //       " | " +
  //       getLatLngLabel(position)
  //   );
  // };

  useEffect(() => {
    if (timeIndex != -1) {
      updateMarkerForPosition(marker.id, timeIndex);

      let position = apiData[timeIndex];
      setPositionLabel(
        getDateString(position.positionDateTime) +
          " | " +
          getLatLngLabel(position)
      );
    }
  }, [timeIndex]);

  return (
    <div onMouseMove={onHover}>
      <Card
        title="Trayectoria de la boya"
        className="custom-tooltip-path-card"
        bordered={false}
      >
        <Spin
          spinning={loading}
          tip="Cargando datos..."
          style={{ color: spinTheme.colorTextBase }}
        >
          {!loading && (
            <Slider
              min={0}
              max={apiData.length - 1}
              step={1}
              value={timeIndex}
              onChange={setTimeIndex}
            />
          )}
        </Spin>
        {positionLabel}
      </Card>
    </div>
  );
};

export default SensorPathDataTooltip;

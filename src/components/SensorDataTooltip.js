import {
  Card,
  Table,
  Descriptions,
  Badge,
  Spin,
  Skeleton,
  Button,
  Slider,
} from "antd";
import { CloseOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import "../styles/sensorDataTooltip.css";
import React, { useEffect, useRef, useState } from "react";
import { getData, getPathData } from "../services/api/marker.service";
import { useMarkerLayersState } from "../states/MarkerLayersState";
import { componentTheme } from "../themes/blueTheme";

const { Spin: spinTheme } = componentTheme.components;

const SensorDataTooltip = ({ onHover, onGraphichOpen, marker, onClose }) => {
  const [apiData, setApiData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [pathApiData, setPathApiData] = useState([]);
  const [timeIndex, setTimeIndex] = useState(-1);
  const [loadingPath, setLoadingPath] = useState(false);
  const [positionLabel, setPositionLabel] = useState(null);

  const { updateMarkerForPosition } = useMarkerLayersState.getState();

  const getApiData = async () => {
    setLoadingData(true);
    let result = await getData(marker.domain, marker.id);
    setApiData(result);
    setLoadingData(false);
  };

  const getApiPathData = async () => {
    setLoadingPath(true);
    let result = await getPathData(marker.domain, marker.id);
    setPathApiData(result);
    setTimeIndex(result.length - 1);
    setLoadingPath(false);
  };

  useEffect(() => {
    setApiData(null);
    setPathApiData([]);
    console.log("entra useEffect");
    if (marker.sensorType !== "LAGRANGNIAN") {
      getApiData();
    }
    if (marker.sensorType === "LAGRANGNIAN") {
      getApiPathData();
    }
  }, [marker]);

  useEffect(() => {
    if (timeIndex !== -1 && marker.sensorType === "LAGRANGNIAN") {
      updateMarkerForPosition(marker.id, timeIndex);
      let position = pathApiData[timeIndex];
      setPositionLabel(
        getDateString(position.positionDateTime) +
          " | " +
          getLatLngLabel(position)
      );
    }
  }, [timeIndex]);

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

  const getPositionLabel = () => {
    if (
      marker.sensorType === "LAGRANGNIAN" &&
      pathApiData.length > 0 &&
      timeIndex !== -1
    ) {
      const position = pathApiData[timeIndex];
      return getLatLngLabel(position);
    } else {
      const cardinalLat = marker.latitude > 0 ? "N" : "S";
      const cardinalLon = marker.longitude > 0 ? "O" : "E";
      return `Lat ${marker.latitude.toFixed(
        2
      )}º ${cardinalLat} Lon ${marker.longitude.toFixed(2)}º ${cardinalLon}`;
    }
  };

  const getStatusLabel = (data) => {
    return data.status == 0 ? "Funcionando" : "Parado";
  };

  const getStatus = (data) => {
    return data.status == 0 ? "processing" : "error";
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "variableName",
      key: "variableName" + Math.random(),
      width: "200px",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (text, record) => `${text.toFixed(4)} ${record.unit}`,
      width: "100px",
    },
  ];

  return (
    <div onMouseMove={onHover}>
      <Card
        title="Datos de la boya"
        className="custom-tooltip-card"
        bordered={false}
        extra={
          <Button
            type="text"
            onClick={onClose}
            icon={<CloseOutlined style={{ color: "white" }} />}
          />
        }
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nombre">{marker.name}</Descriptions.Item>
          <Descriptions.Item label="Posición">
            {getPositionLabel()}
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {" "}
            <Badge status={getStatus(marker)} text={getStatusLabel(marker)} />
          </Descriptions.Item>
          <Descriptions.Item label="Última medición">
            {apiData ? (
              new Date(apiData[0].date).toLocaleString()
            ) : (
              <Skeleton.Input
                style={{ width: 200 }}
                active={true}
                size="small"
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Datos">
            {" "}
            <div style={{ display: "flex", columnGap: 5 }}>
              <Button type="dashed" onClick={onGraphichOpen}>
                Gráficas
              </Button>
              <Button type="dashed" icon={<CloudDownloadOutlined />} size={15}>
                Descargas
              </Button>
            </div>
          </Descriptions.Item>
        </Descriptions>
        {marker.sensorType === "LAGRANGNIAN" && (
          <div className="slider-container">
            <Spin
              spinning={loadingPath}
              tip="Cargando datos..."
              style={{ color: spinTheme.colorTextBase }}
            >
              {!loadingPath && (
                <>
                  <Slider
                    min={0}
                    max={pathApiData.length - 1}
                    step={1}
                    value={timeIndex}
                    onChange={setTimeIndex}
                  />
                  {positionLabel}
                </>
              )}
            </Spin>
          </div>
        )}
        <div className="table-container">
          <Spin
            spinning={loadingData}
            tip="Cargando datos..."
            style={{ color: spinTheme.colorTextBase }}
          >
            {!loadingData && (
              <Table
                columns={columns}
                dataSource={apiData}
                pagination={false}
                rowKey="variableName"
                scroll={{ y: 240 }}
              />
            )}
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default SensorDataTooltip;

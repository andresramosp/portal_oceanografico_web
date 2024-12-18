import {
  Card,
  Table,
  Descriptions,
  Badge,
  Spin,
  Skeleton,
  Button,
  Slider,
  Collapse,
  Space,
  Tooltip,
} from "antd";
import {
  CloseOutlined,
  CloudDownloadOutlined,
  PlayCircleOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
  PauseCircleOutlined,
  SyncOutlined,
  StopFilled,
  StopOutlined,
} from "@ant-design/icons";
import "../styles/sensorDataTooltip.css";
import React, { useEffect, useRef, useState } from "react";
import { getData, getPathData } from "../services/api/marker.service";
import { useMarkerLayersState } from "../states/MarkerLayersState";
import { componentTheme, customClasses } from "../themes/blueTheme";

// Importar LineLayer de deck.gl
import { LineLayer } from "@deck.gl/layers";
import useMapState from "../states/MapState";
import { usePlayingState } from "../states/PlayingState";

const { Spin: spinTheme } = componentTheme.components;

const SensorDataTooltip = ({ onHover, onGraphichOpen, marker, onClose }) => {
  const [apiData, setApiData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const [pathApiData, setPathApiData] = useState([]);
  const [timeIndex, setTimeIndex] = useState(-1);
  const [loadingPath, setLoadingPath] = useState(false);
  const [positionLabel, setPositionLabel] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef(null);

  const [tableData, setTableData] = useState([]);

  const { updateMarkerForPosition } = useMarkerLayersState.getState();

  const {
    syncWithPath,
    unSyncWithPath,
    syncedWithPath,
    setTimeIndex: setPlayerTimeIndex,
  } = usePlayingState();

  // Inicializar mapState
  const mapState = useMapState.getState();
  const pathLayerId = `path-layer-${marker.id}`;

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
    // Eliminar la capa de ruta anterior si existe
    mapState.removeLayers([pathLayerId]);

    // Restablecer el estado cuando el marcador cambia
    setApiData(null);
    setPathApiData([]);
    setTimeIndex(-1);
    setPositionLabel(null);
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }

    if (marker.sensorType !== "LAGRANGNIAN") {
      getApiData();
    }
    if (marker.sensorType === "LAGRANGNIAN") {
      getApiPathData();
    }
  }, [marker]);

  useEffect(() => {
    // Limpiar el intervalo y eliminar la capa de ruta al desmontar
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
      mapState.removeLayers([pathLayerId]);
    };
  }, []);

  useEffect(() => {
    if (timeIndex !== -1 && marker.sensorType === "LAGRANGNIAN") {
      let position = pathApiData[timeIndex];
      updateMarkerForPosition(marker.id, position);
      setPositionLabel(getDateString(position.positionDateTime));
      if (syncedWithPath) {
        setPlayerTimeIndex(timeIndex);
      }
    }
  }, [timeIndex, pathApiData]);

  // Añadir la capa de ruta al mapa cuando pathApiData cambia
  useEffect(() => {
    if (pathApiData && pathApiData.length > 0) {
      // Preparar datos para LineLayer
      const pathLineData = pathApiData.slice(0, -1).map((point, index) => {
        const nextPoint = pathApiData[index + 1];
        return {
          sourcePosition: [point.longitude, point.latitude],
          targetPosition: [nextPoint.longitude, nextPoint.latitude],
        };
      });

      // Crear LineLayer
      const pathLayer = new LineLayer({
        id: pathLayerId,
        data: pathLineData,
        getSourcePosition: (d) => d.sourcePosition,
        getTargetPosition: (d) => d.targetPosition,
        getColor: [255, 0, 0],
        getOpacity: 0.5,
        getWidth: 1,
        userData: {
          option: marker.domain.option,
          zIndex: 3,
        },
      });

      // Añadir o actualizar la capa
      mapState.addOrUpdateLayers([pathLayer]);
    }
  }, [pathApiData]);

  // Obtener los datos para la tabla dependiendo del tipo de boya
  useEffect(() => {
    if (marker.sensorType === "LAGRANGNIAN") {
      // Si ya tenemos los datos de pathApiData y el timeIndex es válido
      if (pathApiData.length > 0 && timeIndex !== -1) {
        const currentPosition = pathApiData[timeIndex];
        const variables = currentPosition.variables || {};
        const formattedData = formatVariablesForTable(variables);
        setTableData(formattedData);
      } else {
        setTableData([]);
      }
    } else {
      // Para boyas Eulerianas, usar apiData
      if (apiData && apiData.length > 0) {
        setTableData(apiData);
      } else {
        setTableData([]);
      }
    }
  }, [apiData, pathApiData, timeIndex]);

  // Función para formatear las variables para la tabla
  const formatVariablesForTable = (variables) => {
    return Object.entries(variables).map(([key, value]) => ({
      variableName: key,
      value: value,
      unit: "", // No tenemos las unidades para las boyas Lagrangianas
    }));
  };

  const handleBackward = () => {
    if (timeIndex > 0) {
      setTimeIndex(timeIndex - 1);
    }
  };

  const handleForward = () => {
    if (timeIndex < pathApiData.length - 1) {
      setTimeIndex(timeIndex + 1);
    }
  };

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      playIntervalRef.current = setInterval(() => {
        setTimeIndex((prevIndex) => {
          if (prevIndex < pathApiData.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(playIntervalRef.current);
            playIntervalRef.current = null;
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, 1200); // Cambiar el tiempo del intervalo según sea necesario
    } else {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
      setIsPlaying(false);
    }
  };

  const syncClick = () => {
    if (!syncedWithPath) {
      syncWithPath(pathApiData, timeIndex);
    } else {
      unSyncWithPath();
    }
  };

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
    return `Lat ${Math.abs(position.latitude).toFixed(
      2
    )}º ${cardinalLat} Lon ${Math.abs(position.longitude).toFixed(
      2
    )}º ${cardinalLon}`;
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
      return `Lat ${Math.abs(marker.latitude).toFixed(
        2
      )}º ${cardinalLat} Lon ${Math.abs(marker.longitude).toFixed(
        2
      )}º ${cardinalLon}`;
    }
  };

  const handleOnClose = () => {
    unSyncWithPath();
    onClose();
  };

  const getStatusLabel = (data) => {
    return data.status === 0 ? "Funcionando" : "Parado";
  };

  const getStatus = (data) => {
    return data.status === 0 ? "processing" : "error";
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "variableName",
      key: "variableName",
      width: "200px",
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (text, record) => `${parseFloat(text).toFixed(4)} ${record.unit}`,
      width: "100px",
    },
  ];

  const defaultActiveKey = marker.sensorType === "LAGRANGNIAN" ? [] : ["1"];

  return (
    <div onMouseMove={onHover}>
      <Card
        title="Datos de la boya"
        className="custom-tooltip-card"
        bordered={false}
        extra={
          <Button
            type="text"
            onClick={handleOnClose}
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
            <Badge status={getStatus(marker)} text={getStatusLabel(marker)} />
          </Descriptions.Item>
          {marker.sensorType !== "LAGRANGNIAN" && (
            <Descriptions.Item label="Última medición">
              {apiData && apiData.length > 0 ? (
                new Date(apiData[0].date).toLocaleString()
              ) : (
                <Skeleton.Input
                  style={{ width: 200 }}
                  active={true}
                  size="small"
                />
              )}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Datos">
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
          <div className="slider-main-container">
            <Spin
              spinning={loadingPath}
              tip="Cargando datos..."
              style={{ color: spinTheme.colorTextBase }}
            >
              {!loadingPath && (
                <>
                  <div className="slider-container">
                    <Slider
                      style={{ width: "95%" }}
                      min={0}
                      max={pathApiData.length - 1}
                      step={1}
                      value={timeIndex}
                      onChange={setTimeIndex}
                    />
                    <div className="label-path-class">{positionLabel}</div>
                    <Space
                      style={{
                        width: "350px",
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Tooltip
                        title={
                          !syncedWithPath
                            ? "Sincronizar con el reproductor"
                            : "Cancelar sincronización"
                        }
                      >
                        <Button
                          onClick={syncClick}
                          icon={
                            !syncedWithPath ? (
                              <SyncOutlined />
                            ) : (
                              <StopOutlined style={{ color: "red" }} />
                            )
                          }
                        ></Button>
                      </Tooltip>

                      <Button
                        onClick={handleBackward}
                        disabled={timeIndex <= 0 || isPlaying}
                        icon={<StepBackwardOutlined />}
                      >
                        Atrás
                      </Button>
                      <Button
                        onClick={handleForward}
                        disabled={
                          timeIndex >= pathApiData.length - 1 || isPlaying
                        }
                        icon={<StepForwardOutlined />}
                      >
                        Adelante
                      </Button>
                      <Button
                        onClick={handlePlay}
                        disabled={pathApiData.length === 0}
                        icon={
                          isPlaying ? (
                            <PauseCircleOutlined />
                          ) : (
                            <PlayCircleOutlined />
                          )
                        }
                      >
                        {isPlaying ? "Pausar" : "Play"}
                      </Button>
                    </Space>
                  </div>
                </>
              )}
            </Spin>
          </div>
        )}
        <div className="sensorData-container">
          <Collapse
            defaultActiveKey={defaultActiveKey}
            style={{ ...customClasses }}
          >
            <Collapse.Panel header="Mediciones" key="1">
              <div className="table-container">
                <Spin
                  spinning={loadingData || loadingPath}
                  tip="Cargando datos..."
                  style={{ color: spinTheme.colorTextBase }}
                >
                  {!loadingData && !loadingPath && (
                    <Table
                      columns={columns}
                      dataSource={tableData}
                      pagination={false}
                      rowKey="variableName"
                      scroll={{ y: 240 }}
                    />
                  )}
                </Spin>
              </div>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Card>
    </div>
  );
};

export default SensorDataTooltip;

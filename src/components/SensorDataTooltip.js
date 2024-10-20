import { Card, Table, Descriptions, Badge, Spin, Skeleton, Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import "../styles/sensorDataTooltip.css";
import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { getData } from "../services/api/marker.service";
import { componentTheme } from "../themes/blueTheme";

const { Spin: spinTheme } = componentTheme.components;

const SensorDataTooltip = ({ onHover, onGraphichOpen, marker }) => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar el loading
  const debouncedGetDataRef = useRef(null);

  const cancelDebounce = () => {
    if (debouncedGetDataRef.current) {
      debouncedGetDataRef.current.cancel();
      debouncedGetDataRef.current = null;
    }
  };

  const getApiData = async () => {
    setLoading(true);
    let result = await getData(marker.domain, marker.id);
    setApiData(result);
    setLoading(false);
  };

  useEffect(() => {
    cancelDebounce();
    debouncedGetDataRef.current = debounce(() => {
      getApiData();
    }, 450);
    debouncedGetDataRef.current();
    return () => debouncedGetDataRef.current.cancel();
  }, []);

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

  const getPositionLabel = (data) => {
    const cardinalLat = marker.latitude > 0 ? "N" : "S";
    const cardinalLon = marker.longitude > 0 ? "O" : "E";
    return `Lat ${marker.latitude.toFixed(
      2
    )}º ${cardinalLat} Lon ${marker.longitude.toFixed(2)}º ${cardinalLon}`;
  };

  const getStatusLabel = (data) => {
    return data.status == 0 ? "Funcionando" : "Parado";
  };

  const getStatus = (data) => {
    return data.status == 0 ? "processing" : "error";
  };

  return (
    <div onMouseMove={onHover}>
      <Card
        title="Datos de la boya"
        className="custom-tooltip-card"
        bordered={false}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Nombre">{marker.name}</Descriptions.Item>
          <Descriptions.Item label="Posición">
            {getPositionLabel(marker)}
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
        <div className="table-container">
          <Spin
            spinning={loading}
            tip="Cargando datos..."
            style={{ color: spinTheme.colorTextBase }}
          >
            {!loading && (
              <Table
                columns={columns}
                dataSource={apiData}
                pagination={false}
                rowKey="variableName"
                scroll={{ y: 240 }} // Ajusta el valor de `y` según el alto máximo que necesites
              />
            )}
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default SensorDataTooltip;

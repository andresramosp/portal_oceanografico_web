import { Card, Table, Descriptions, Badge, Spin, Skeleton, Button } from "antd";
import { CloudDownloadOutlined } from "@ant-design/icons";
import "../styles/customTooltip.css";
import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

const CustomTooltip = ({ data }) => {
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
    let result = await data.callback();
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
      dataIndex: "name",
      key: "name",
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
    const cardinalLat = data.latitude > 0 ? "N" : "S";
    const cardinalLon = data.longitude > 0 ? "O" : "E";
    return `Lat ${data.latitude.toFixed(
      2
    )}º ${cardinalLat} Lon ${data.longitude.toFixed(2)}º ${cardinalLon}`;
  };

  const getStatusLabel = (data) => {
    return data.running ? "Funcionando" : "Parado";
  };

  const getStatus = (data) => {
    return data.running ? "processing" : "error";
  };

  return (
    <Card title="Datos de la boya" className="custom-tooltip-card">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Nombre">{data.name}</Descriptions.Item>
        <Descriptions.Item label="Posición">
          {getPositionLabel(data)}
        </Descriptions.Item>
        <Descriptions.Item label="Estado">
          {" "}
          <Badge status={getStatus(data)} text={getStatusLabel(data)} />
        </Descriptions.Item>
        <Descriptions.Item label="Última medición">
          {apiData ? (
            new Date(apiData[0].lastMeasurementDate).toLocaleString()
          ) : (
            <Skeleton.Input style={{ width: 200 }} active={true} size="small" />
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Datos">
          {" "}
          <div style={{ display: "flex", columnGap: 5 }}>
            <Button type="dashed">Gráficas</Button>
            <Button type="dashed" icon={<CloudDownloadOutlined />} size={15}>
              Descargas
            </Button>
          </div>
        </Descriptions.Item>
      </Descriptions>
      <div className="table-container">
        <Spin spinning={loading} tip="Cargando datos...">
          {!loading && (
            <Table
              columns={columns}
              dataSource={apiData}
              pagination={false}
              rowKey="name"
              scroll={{ y: 240 }} // Ajusta el valor de `y` según el alto máximo que necesites
            />
          )}
        </Spin>
      </div>
    </Card>
  );
};

export default CustomTooltip;

import { Card, Table } from "antd";
import "../styles/customTooltip.css";

import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";

const CustomTooltip = ({ data }) => {
  const [apiData, setApiData] = useState(null);
  const debouncedGetDataRef = useRef(null);

  const cancelDebounce = () => {
    if (debouncedGetDataRef.current) {
      debouncedGetDataRef.current.cancel();
      debouncedGetDataRef.current = null;
    }
  };

  const getApiData = async () => {
    let result = await data.callback();
    setApiData(result);
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
    },
    {
      title: "Valor",
      dataIndex: "value",
      key: "value",
      render: (text, record) => `${text} ${record.unit}`,
    },
    {
      title: "Fecha de Última Medición",
      dataIndex: "lastMeasurementDate",
      key: "lastMeasurementDate",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  return (
    <Card title="Datos de la boya" className="custom-tooltip-card">
      <p>
        <strong>Nombre:</strong> {data.name}
      </p>
      <p>
        <strong>Latitud:</strong> {data.latitude}
      </p>
      <p>
        <strong>Longitud:</strong> {data.longitude}
      </p>
      <Table
        columns={columns}
        dataSource={apiData}
        pagination={false}
        rowKey="name"
      />
    </Card>
  );
};

export default CustomTooltip;

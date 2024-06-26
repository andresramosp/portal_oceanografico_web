import { Card, Table } from "antd";
import "../styles/customTooltip.css";

import React, { useEffect, useState } from "react";

const CustomTooltip = ({ data }) => {
  const [variables, setVariables] = useState([]);

  // Fake API call to get variables data
  useEffect(() => {
    const fetchVariables = () => {
      // Simula una llamada API para obtener las variables
      const fakeData = [
        {
          name: "Salinidad",
          value: 35.0,
          unit: "PSU",
          lastMeasurementDate: "2024-01-29T11:35:43.912+00:00",
        },
        {
          name: "Temperatura",
          value: 22.5,
          unit: "°C",
          lastMeasurementDate: "2024-01-29T11:35:43.912+00:00",
        },
      ];
      setVariables(fakeData);
    };

    fetchVariables();
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
        dataSource={variables}
        pagination={false}
        rowKey="name"
      />
    </Card>
  );
};

export default CustomTooltip;

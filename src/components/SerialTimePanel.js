import React, { useEffect, useRef, useState } from "react";
import { Drawer, Select, DatePicker, Button } from "antd";
import SerialTimeGraphics from "./SerialTimeGraphic";
import { getSerialTimeData } from "../services/api/marker.service";

const { Option } = Select;
const { RangePicker } = DatePicker;

const mockVariables = [
  { variableName: "Temperatura del agua", variableId: 3 },
  { variableName: "Velocidad del viento", variableId: 432 },
];

export const SerialTimePanel = ({ handleDrawerClose, marker }) => {
  const [data, setData] = useState(null);
  const variables = useRef([]);
  const [selectedVariableId, setSelectedVariableId] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [initDone, setInitDone] = useState(false);

  const getVariables = async () => {
    // TODO: API call
    variables.current = mockVariables;
  };

  const getData = async () => {
    const result = await getSerialTimeData(
      marker.domain,
      marker.id,
      selectedVariableId,
      "2024-01-23T00:00:00",
      "2024-01-23T06:00:00"
    );
    setData(
      result.map((val) => {
        return { ...val, value: parseFloat(val.value.toFixed(4)) };
      })
    );
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const init = async () => {
    await getVariables();
    setSelectedVariableId(variables.current[1].variableId);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (selectedVariableId && !initDone) {
      getData();
      setInitDone(true);
    }
  }, [selectedVariableId]);

  return (
    <Drawer
      placement="bottom"
      height={400}
      onClose={handleDrawerClose}
      visible={true}
      headerStyle={{ display: "none" }}
    >
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Seleccionar variable"
          style={{ width: 200, marginRight: 16, marginLeft: 35 }}
          onChange={setSelectedVariableId}
          value={selectedVariableId}
          id="variableId"
        >
          {variables.current.map((variable) => (
            <Option key={variable.variableId} value={variable.variableId}>
              {variable.variableName}
            </Option>
          ))}
        </Select>

        <RangePicker
          onChange={handleDateRangeChange}
          style={{ marginRight: 16 }}
        />
        <Button type="primary" onClick={getData}>
          Crear gráfica
        </Button>
      </div>
      <SerialTimeGraphics data={data} />
    </Drawer>
  );
};

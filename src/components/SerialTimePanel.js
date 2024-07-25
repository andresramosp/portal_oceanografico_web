import React, { useEffect, useRef, useState } from "react";
import { Drawer, Select, DatePicker, Button, Spin, Tooltip } from "antd";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import SerialTimeGraphics from "./SerialTimeGraphic";
import { getSerialTimeData } from "../services/api/marker.service";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const mockVariables = [
  { variableName: "Temperatura del agua", variableId: 3 },
  { variableName: "Velocidad del viento", variableId: 432 },
];

const antIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;

export const SerialTimePanel = ({ handleDrawerClose, marker }) => {
  const [data, setData] = useState(null);
  const variables = useRef([]);
  const [selectedVariableId, setSelectedVariableId] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(3, "day").startOf("day"),
    dayjs().startOf("day"),
  ]);
  const [initDone, setInitDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  const getVariables = async () => {
    // TODO: API call
    variables.current = mockVariables;
  };

  const getData = async () => {
    setData(null);
    setLoading(true);
    const from = dateRange[0].format("YYYY-MM-DDT00:00:00");
    const to = dateRange[1].add(1, "day").format("YYYY-MM-DDT00:00:00");
    const result = await getSerialTimeData(
      marker.domain,
      marker.id,
      selectedVariableId,
      from,
      to
    );
    setData(
      result.map((val) => {
        return { ...val, value: parseFloat(val.value.toFixed(4)) };
      })
    );
    setLoading(false);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.zoomOut();
    }
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", columnGap: 10 }}>
          <Select
            placeholder="Seleccionar variable"
            style={{ width: 200, marginLeft: 35 }}
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

          <RangePicker onChange={handleDateRangeChange} value={dateRange} />
          <Button type="primary" onClick={getData} disabled={loading}>
            Crear gráfica{" "}
            {loading && (
              <Spin
                indicator={antIcon}
                style={{ marginLeft: 8, marginBottom: 5 }}
              />
            )}
          </Button>
          <Tooltip title="Zoom Out">
            <Button
              icon={<FullscreenExitOutlined style={{ fontSize: 22 }} />}
              onClick={handleZoomOut}
            />
          </Tooltip>
        </div>
        <img
          src={`/logos/${marker.domain.sourceId}.png`}
          width={160}
          style={{ marginRight: 10 }}
        />
      </div>
      <SerialTimeGraphics ref={chartRef} data={data} />
    </Drawer>
  );
};

import React, { useEffect, useState } from "react";
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  Tooltip,
  Legend,
  ZoomAndPan,
  Crosshair,
  Size,
  Aggregation,
  Point,
  CommonSeriesSettings,
  Label,
  HorizontalLine,
  VerticalLine,
} from "devextreme-react/chart";
import { getSerialTimeData } from "../services/api/marker.service";

// const aggregationFunction = (aggregationInfo, series) => {
//   // Define tu función de agregación aquí si es necesario
//   return {
//     date: aggregationInfo.intervalStart,
//     temperature:
//       aggregationInfo.data.reduce((acc, item) => acc + item.temperature, 0) /
//       aggregationInfo.data.length,
//   };
// };

const customizeTooltip = (info) => {
  return {
    text: `Temperatura: ${info.valueText}°C`,
  };
};

const customizeCrossHairLabel = (info) => {
  return `${info.valueText}°C`;
};

const customizeArgumentAxisLabel = (info) => {
  return info.valueText;
};

const SerialTimeGraphics = ({ marker }) => {
  const [data, setData] = useState(null);

  const getData = async () => {
    const result = await getSerialTimeData(
      marker.domain,
      marker.id,
      432,
      "2024-01-23T00:00:00",
      "2024-01-24T04:00:00"
    );
    setData(result);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Chart
      id="chart"
      dataSource={data}
      onPointClick={(e) => console.log(e)}
      onPointHoverChanged={(e) => console.log(e)}
      onLegendClick={(e) => console.log(e)}
      onZoomEnd={(e) => console.log(e)}
    >
      <CommonSeriesSettings hoverMode="onlyPoint" argumentField="date" />

      <Series
        valueField="value"
        name="Temperatura del Agua"
        type="line"
        width={1.5}
        hoverStyle={{ width: 1.5 }}
      >
        {/* <Aggregation
          method="custom"
          calculate={aggregationFunction}
          enabled={true}
        /> */}
        <Point size={5} hoverStyle={{ size: 3 }} />
      </Series>

      <Size height={300} />
      <ZoomAndPan
        dragToZoom={true}
        allowMouseWheel={false}
        valueAxis="both"
        argumentAxis="both"
        panKey="shift"
      />
      <Legend
        visible={true}
        orientation="horizontal"
        position="outside"
        itemTextPosition="right"
        horizontalAlignment="center"
        verticalAlignment="top"
        hoverMode="none"
      />

      <ArgumentAxis
        aggregationGroupWidth={1}
        argumentType="datetime"
        axisDivisionFactor={100}
      >
        <Label customizeText={customizeArgumentAxisLabel} />
      </ArgumentAxis>
      <ValueAxis title="Temperatura (°C)" />

      <Tooltip enabled={true} customizeTooltip={customizeTooltip} />

      <Crosshair enabled={true}>
        <Label
          backgroundColor="rgb(21, 91, 140)"
          visible={true}
          customizeText={customizeCrossHairLabel}
        />
        <HorizontalLine color="rgb(21, 91, 140)" opacity={0.4} />
        <VerticalLine color="rgb(21, 91, 140)" opacity={0.4} />
      </Crosshair>
    </Chart>
  );
};

export default SerialTimeGraphics;

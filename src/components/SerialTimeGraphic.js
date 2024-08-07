import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
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
  Point,
  CommonSeriesSettings,
  Label,
  HorizontalLine,
  VerticalLine,
} from "devextreme-react/chart";
import { getSerialTimeData } from "../services/api/marker.service";

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

const getTitle = (data) => {
  if (data?.length) return `${data[0].variableName} (${data[0].unit})`;
  return "";
};

const SerialTimeGraphics = forwardRef(({ data }, ref) => {
  const chartRef = useRef(null);

  useImperativeHandle(ref, () => ({
    zoomOut: () => {
      if (chartRef.current) {
        chartRef.current.instance().resetVisualRange();
      }
    },
  }));

  return (
    <Chart
      id="chart"
      ref={chartRef}
      dataSource={data}
      onPointClick={(e) => console.log(e)}
      onPointHoverChanged={(e) => console.log(e)}
      onLegendClick={(e) => console.log(e)}
      onZoomEnd={(e) => console.log(e)}
    >
      <CommonSeriesSettings hoverMode="onlyPoint" argumentField="date" />

      <Series
        valueField="value"
        name={getTitle(data)}
        type="line"
        width={1.5}
        hoverStyle={{ width: 1.5 }}
      >
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
        visible={false}
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
      <ValueAxis title={getTitle(data)} />

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
});

export default SerialTimeGraphics;

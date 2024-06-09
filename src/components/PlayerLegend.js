import React, { useEffect, useState } from "react";
import { Slider, Button, DatePicker, Space } from "antd";
import PaletteService from "../services/palette.service";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";

export const PlayerLegend = () => {
  const { paletteDistribution, paletteMinMax } = useHeatmapLayersState();

  useEffect(() => {
    let colorLegendComp = document.querySelector("color-legend");
    colorLegendComp.range = PaletteService.getColorsDistribution(
      "temperature",
      paletteDistribution,
      false
    );
    colorLegendComp.domain = [paletteMinMax.min, paletteMinMax.max];
  }, [paletteDistribution]);

  return (
    <div className="player-legend-container">
      <Space direction="vertical">
        <color-legend class="styled" titletext=""></color-legend>
      </Space>
    </div>
  );
};

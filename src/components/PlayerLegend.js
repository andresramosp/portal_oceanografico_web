import React, { useEffect } from "react";
import { Space } from "antd";
import PaletteService from "../services/palette.service";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { componentTheme } from "../themes/blueTheme";

const { Player: playerTheme } = componentTheme.components;

export const PlayerLegend = () => {
  const { paletteDistribution, paletteMinMax, variable } =
    useHeatmapLayersState();

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
      <Space
        direction="horizontal"
        style={{ alignItems: "flex-start", columnGap: "0px" }}
      >
        <span style={{ color: playerTheme.colorTextBase, fontSize: "14px" }}>
          {variable.charAt(0).toUpperCase() + variable.slice(1)}
        </span>
        <color-legend class="styled" titletext=""></color-legend>
      </Space>
    </div>
  );
};

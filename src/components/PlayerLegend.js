import React, { useEffect } from "react";
import { Space } from "antd";
import PaletteService from "../services/palette.service";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { componentTheme } from "../themes/blueTheme";
import { variableIcons } from "../resources/menuIcons";

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

  const IconComponent = variableIcons[variable];

  return (
    <div className="player-legend-container">
      <Space
        direction="horizontal"
        style={{ alignItems: "flex-start", columnGap: "0px" }}
      >
        <IconComponent
          style={{
            color: playerTheme.colorTextBase,
            marginRight: "3px",
          }}
          alt="Descripción del icono"
        />
        <span style={{ color: playerTheme.colorTextBase, fontSize: "14px" }}>
          {variable.charAt(0).toUpperCase() + variable.slice(1)}
        </span>
        <color-legend class="styled" titletext=""></color-legend>
      </Space>
    </div>
  );
};

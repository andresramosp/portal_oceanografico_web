export default [
  {
    sectionName: "Oceanografía",
    options: [
      {
        id: "pde-salinity",
        optionName: "Salinidad PdE",
        optionType: "actionable",
        variable: "salinity",
        sourceId: "pde",
        resourceType: "heatmap-layer",
      },
      {
        id: "pde-temperature",
        optionName: "Temperatura PdE",
        optionType: "actionable",
        variable: "temperature",
        sourceId: "pde",
        resourceType: "heatmap-layer",
      },
      {
        id: "copernicus-wind",
        optionName: "Viento Copernicus",
        optionType: "actionable",
        variable: "wind",
        resourceType: "heatmap-layer",
      },
      {
        optionName: "Dispositivos Southtek",
        optionType: "dropdown",
        options: [
          {
            id: "southtek-currents",
            optionName: "Corrientes",
            optionType: "actionable",
            variable: "currents",
            sourceId: "southtek",
            resourceType: "marker",
          },
          {
            id: "southtek-clorofila",
            optionName: "Clorofila",
            optionType: "actionable",
            variable: "clorophile",
            sourceId: "southtek",
            resourceType: "marker",
          },
        ],
      },
    ],
  },
  {
    sectionName: "Geología",
    options: [
      {
        optionName: "Estratos Angola",
        optionType: "dropdown",
        options: [
          {
            id: "IGEO-inner",
            optionName: "Zona Interior",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature-layer",
          },
          {
            id: "IGEO-coast",
            optionName: "Costa",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature-layer",
          },
        ],
      },
    ],
  },
];

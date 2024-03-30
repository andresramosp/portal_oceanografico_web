export default [
  {
    sectionName: "Oceanografía",
    options: [
      {
        optionName: "Salinidad PdE",
        optionType: "actionable",
        variable: "salinity",
        sourceId: "pde",
        resourceType: "heatmap-layer",
      },
      {
        optionName: "Temperatura PdE",
        optionType: "actionable",
        variable: "temperature",
        sourceId: "pde",
        resourceType: "heatmap-layer",
      },
      {
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
            optionName: "Corrientes",
            optionType: "actionable",
            variable: "currents",
            sourceId: "southtek",
            resourceType: "marker",
          },
          {
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
            optionName: "Zona Interior",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature-layer",
          },
          {
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

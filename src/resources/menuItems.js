export default [
  {
    sectionName: "Oceanografía",
    options: [
      {
        id: "pde-salinity",
        optionName: "Salinidad PdE",
        optionType: "actionable",
        variable: "salinity",
        mapResources: [
          {
            id: "pde-salinity-alm",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/ALM-CST",
          },
          {
            id: "pde-salinity-gibreg",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/GIB-REG",
          },
        ],
      },
      {
        id: "pde-currents-GIB",
        optionName: "Corrientes PdE GIB",
        optionType: "actionable",
        variable: "currents",
        mapResources: [
          {
            id: "pde-currents-GIB",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/GIB-REG",
          },
          {
            id: "pde-currents-particles-GIB",
            sourceId: "pde",
            resourceType: "particles",
            url: "/GIB-REG",
          },
        ],
      },
      {
        id: "pde-currents-ALM",
        optionName: "Corrientes PdE ALM",
        optionType: "actionable",
        variable: "currents",
        mapResources: [
          {
            id: "pde-currents-alm",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/ALM-CST",
          },
        ],
      },
      // {
      //   id: "pde-currents-particles",
      //   optionName: "Particulas Corrientes PdE",
      //   optionType: "actionable",
      //   variable: "currents",
      //   mapResources: [
      //     {
      //       id: "pde-currents-particles-GIB",
      //       sourceId: "pde",
      //       resourceType: "particles",
      //       url: "/GIB-REG",
      //     },
      //   ],
      // },
      // {
      //   id: "pde-currents-GIB",
      //   optionName: "Corrientes PdE GIB",
      //   optionType: "actionable",
      //   variable: "currents",
      //   mapResources: [
      //     // {
      //     //   id: "pde-currents-particles-GIB",
      //     //   sourceId: "pde",
      //     //   resourceType: "particles",
      //     //   url: "/GIB-REG",
      //     // },
      //     {
      //       id: "pde-currents-gibreg",
      //       sourceId: "pde",
      //       resourceType: "heatmap",
      //       url: "/GIB-REG",
      //     },
      //   ],
      // },
      // {
      //   id: "pde-salinity-ALM",
      //   optionName: "Salinidad PdE ALM",
      //   optionType: "actionable",
      //   variable: "salinity",
      //   mapResources: [
      //     {
      //       id: "pde-salinity-alm",
      //       sourceId: "pde",
      //       resourceType: "heatmap",
      //       url: "/ALM-CST",
      //     },
      //   ],
      // },
      // {
      //   id: "pde-temperature",
      //   optionName: "Temperatura PdE",
      //   optionType: "actionable",
      //   variable: "temperature",
      //   mapResources: [
      //     {
      //       id: "pde-temperature",
      //       sourceId: "pde",
      //       resourceType: "heatmap",
      //       url: null, // traerá domains por variable y sourceId
      //     },
      //   ],
      // },
      {
        id: "pde-tiles-currents",
        optionName: "Corrientes Tiles PdE",
        optionType: "actionable",
        variable: "currents",
        mapResources: [
          {
            id: "pde-tiles-currents",
            sourceId: "pde",
            resourceType: "tilemap",
            url: null, // traerá domains por variable y sourceId
          },
        ],
      },
      // {
      //   id: "copernicus-wind",
      //   optionName: "Viento Copernicus",
      //   optionType: "actionable",
      //   variable: "wind",
      //   resourceType: "heatmap",
      // },
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
            resourceType: "feature",
          },
          {
            id: "IGEO-coast",
            optionName: "Costa",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature",
            mapResources: [
              {
                id: "IGEO-coast",
                sourceId: "igeo",
                resourceType: "geojson",
                url: null,
              },
            ],
          },
        ],
      },
    ],
  },
];

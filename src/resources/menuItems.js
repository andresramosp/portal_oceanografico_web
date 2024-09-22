export default [
  {
    sectionName: "Oceanografía",
    options: [
      {
        id: "cop-temp-global",
        optionName: "Temp Copernicus Glboal",
        optionType: "actionable",
        variable: "thetao",
        mapResources: [
          {
            id: "cop-temp-global",
            sourceId: "copernicus",
            resourceType: "heatmap",
            url: null,
          },
        ],
      },
      {
        id: "pde-salinity-GIB",
        optionName: "Salinidad PdE GIB",
        optionType: "actionable",
        variable: "salinity",
        mapResources: [
          {
            id: "pde-salinity-gibreg",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/GIB-REG",
          },
        ],
      },
      {
        id: "pde-temp-GIB",
        optionName: "Temperatura PdE GIB",
        optionType: "actionable",
        variable: "temperature",
        mapResources: [
          {
            id: "pde-temp-gibreg",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/GIB-REG",
          },
        ],
      },
      {
        id: "pde-salinity-ALM",
        optionName: "Salinidad PdE ALM",
        optionType: "actionable",
        variable: "salinity",
        mapResources: [
          {
            id: "pde-salinity-alm",
            sourceId: "pde",
            resourceType: "heatmap",
            url: "/ALM-CST",
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
          // {
          //   id: "pde-currents-particles-GIB",
          //   sourceId: "pde",
          //   resourceType: "particles",
          //   url: "/GIB-REG",
          // },
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
      {
        id: "pde-currents-particles",
        optionName: "Particulas Corrientes GIB",
        optionType: "actionable",
        variable: "currents",
        mapResources: [
          {
            id: "pde-currents-particles-GIB",
            sourceId: "pde",
            resourceType: "particles",
            url: "/GIB-REG",
          },
        ],
      },
      {
        id: "pde-currents-particles-alm",
        optionName: "Particulas Corrientes ALM",
        optionType: "actionable",
        variable: "currents",
        mapResources: [
          {
            id: "pde-currents-particles-ALM",
            sourceId: "pde",
            resourceType: "particles",
            url: "/ALM-CST",
          },
        ],
      },
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
      {
        id: "cop-tiles-temp",
        optionName: "Temp. Tiles Cop.",
        optionType: "actionable",
        variable: "temp",
        mapResources: [
          {
            id: "cop-tiles-tem",
            sourceId: "pde",
            resourceType: "tilemap",
            url: null, // traerá domains por variable y sourceId
          },
        ],
      },
      {
        optionName: "Dispositivos Southtek",
        optionType: "dropdown",
        options: [
          {
            id: "boyas-eulerianas",
            optionName: "Boyas Eulerianas",
            optionType: "actionable",
            mapResources: [
              {
                sourceId: "southtek",
                resourceType: "sensor",
                url: "/boyas-eulerianas",
              },
            ],
          },
          {
            id: "boyas-moviles",
            optionName: "Boyas Moviles",
            optionType: "actionable",
            mapResources: [
              {
                sourceId: "southtek",
                resourceType: "sensor",
                url: "/boyas-moviles",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    sectionName: "BIO",
    options: [
      {
        id: "nasa-bio-0",
        optionName: "Nasa BIO 0",
        optionType: "actionable",
        variable: "bio",
        mapResources: [
          {
            id: "cop-bio-0",
            sourceId: "nasa",
            resourceType: "heatmap",
            url: "/CHELSA-BIO-0",
          },
        ],
      },
      {
        id: "nasa-bio-1",
        optionName: "Nasa BIO 1",
        optionType: "actionable",
        variable: "bio",
        mapResources: [
          {
            id: "cop-bio-1",
            sourceId: "nasa",
            resourceType: "heatmap",
            url: "/CHELSA-BIO-1",
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
            id: "IGEO-coast-units",
            optionName: "Costa - Unidades",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature",
            mapResources: [
              {
                id: "IGEO-coast-units",
                sourceId: "igeo",
                resourceType: "geojson",
                url: "/ANG-GEO-Units",
              },
            ],
          },
          {
            id: "IGEO-coast-structures",
            optionName: "Costa - Estructuras",
            optionType: "actionable",
            variable: "geological",
            sourceId: "IGEO",
            resourceType: "feature",
            mapResources: [
              {
                id: "IGEO-coast-structures",
                sourceId: "igeo",
                resourceType: "geojson",
                url: "/ANG-GEO-Structures",
              },
            ],
          },
        ],
      },
    ],
  },
];

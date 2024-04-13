const API_BASE_URL = "http://localhost:8080";

export const getDomains = async (option) => {
  let result = [];
  for (let mapResource of option.mapResources) {
    let resDomains;
    if (mapResource.url) {
      const response = await fetch(
        `${API_BASE_URL}/api/${mapResource.resourceType}/domains${mapResource.url}?sourceId=${mapResource.sourceId}`
      );
      resDomains = await response.json();
    } else {
      const response = await fetch(
        `${API_BASE_URL}/api/${mapResource.resourceType}/domains?variable=${option.variable}&sourceId=${mapResource.sourceId}`
      );
      resDomains = await response.json();
    }

    if (Array.isArray(resDomains)) {
      resDomains = resDomains.map((r) => {
        return { ...r, domainType: mapResource.resourceType };
      });
      result = result.concat(resDomains);
    } else {
      resDomains = { ...resDomains, domainType: mapResource.resourceType };
      result.push(resDomains);
    }
  }

  result = result.map((d) => {
    return { ...d, option };
  });

  return {
    heatmapDomains: result.filter((d) => d.domainType == "heatmap"),
    tilemapDomains: result.filter((d) => d.domainType == "tilemap"),
    featureDomains: result.filter((d) => d.domainType == "feature"),
  };
};

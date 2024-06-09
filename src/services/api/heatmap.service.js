import GeodesicService from "../geodesic.service";

const API_BASE_URL = "http://localhost:8080";

export const getPalette = async (domains, from, to, variables) => {
  const response = await fetch(`${API_BASE_URL}/api/heatmap/palette`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId: domains[0].sourceId,
      domainsId: domains.map((d) => d.id),
      from,
      to,
      variables,
    }),
  });
  return response.json();
};

export const getLayerForTime = async (
  date,
  domain,
  minValue,
  maxValue,
  variables
) => {
  console.log(GeodesicService.getViewBounds());
  const response = await fetch(`${API_BASE_URL}/api/heatmap/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId: domain.sourceId,
      domainId: domain.id,
      date,
      minValue,
      maxValue,
      variables,
      bounds: GeodesicService.getViewBounds(),
      zoom: 8, // TODO
    }),
  });
  return response.json();
};

export const getDateRange = async (domains) => {
  const response = await fetch(`${API_BASE_URL}/api/heatmap/daterange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId: domains[0].sourceId,
      domainId: domains[0].id,
    }),
  });
  return response.json();
};

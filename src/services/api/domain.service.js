const API_BASE_URL = "http://localhost:8080";

export const getDomains = async (option) => {
  const response = await fetch(
    `${API_BASE_URL}/api/heatmap/domains?variable=${option.variable}&sourceId=${option.sourceId}`
  );
  return response.json();
};

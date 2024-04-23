const API_BASE_URL = "http://localhost:8080";

export const getLayers = async (domain) => {
  const response = await fetch(
    `${API_BASE_URL}/api/geojson/data?sourceId=${domain.sourceId}&domainId=${domain.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

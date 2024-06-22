const API_BASE_URL = "http://localhost:8080";

export const getMarkers = async (domain) => {
  const response = await fetch(
    `${API_BASE_URL}/api/sensor/list?sourceId=${domain.sourceId}&domainId=${domain.id}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

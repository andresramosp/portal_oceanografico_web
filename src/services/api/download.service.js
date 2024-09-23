const API_BASE_URL = "http://localhost:8080";

export const downloadHeatmap = async (items) => {
  let response = await fetch(`${API_BASE_URL}/api/download/heatmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(items),
  });
  response = await response.json();
  return response;
};

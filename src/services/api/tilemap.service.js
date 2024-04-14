const API_BASE_URL = "http://localhost:8080";

export const getDateRange = async (domains) => {
  const response = await fetch(`${API_BASE_URL}/api/tilemap/daterange`, {
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

export const formatDate = (jsonDate) => {
  const date = new Date(jsonDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getUTCHours().toString().padStart(2, "0");

  return parseInt(`${year}${month}${day}${hour}`);
};

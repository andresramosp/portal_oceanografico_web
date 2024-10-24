const API_BASE_URL = "http://localhost:8080";

export const getMarkers = async (domain) => {
  const response = await fetch(
    `${API_BASE_URL}/api/sensor/list/${domain.id}?sourceId=${domain.sourceId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export const getData = async (domain, sensorId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/sensor/data/${domain.id}?sourceId=${domain.sourceId}&sensorId=${sensorId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export const getPathData = async (domain, sensorId) => {
  const response = await fetch(
    `${API_BASE_URL}/api/sensor/pathdata/${domain.id}?sourceId=${domain.sourceId}&sensorId=${sensorId}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

export const getSerialTimeData = async (
  domain,
  sensorId,
  variableId,
  from,
  to
) => {
  const response = await fetch(`${API_BASE_URL}/api/sensor/datarange`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domainId: domain.id,
      sensorId,
      sourceId: domain.sourceId,
      from,
      to,
      variableId,
    }),
  });
  return response.json();
};

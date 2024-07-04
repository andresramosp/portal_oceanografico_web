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

export const getSerialTimeData = async (domain, sensorId) => {
  const dataSource = [
    { fecha: new Date(2024, 6, 1, 0), temperatura: 22 },
    { fecha: new Date(2024, 6, 1, 1), temperatura: 21 },
    { fecha: new Date(2024, 6, 1, 2), temperatura: 20.5 },
    { fecha: new Date(2024, 6, 1, 3), temperatura: 20 },
    { fecha: new Date(2024, 6, 1, 4), temperatura: 19.5 },
    { fecha: new Date(2024, 6, 1, 5), temperatura: 19 },
    { fecha: new Date(2024, 6, 1, 6), temperatura: 19.2 },
    { fecha: new Date(2024, 6, 1, 7), temperatura: 20 },
    { fecha: new Date(2024, 6, 1, 8), temperatura: 21 },
    { fecha: new Date(2024, 6, 1, 9), temperatura: 22 },
    { fecha: new Date(2024, 6, 1, 10), temperatura: 23 },
    { fecha: new Date(2024, 6, 1, 11), temperatura: 24 },
    { fecha: new Date(2024, 6, 1, 12), temperatura: 25 },
    { fecha: new Date(2024, 6, 1, 13), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 1, 14), temperatura: 26 },
    { fecha: new Date(2024, 6, 1, 15), temperatura: 26.2 },
    { fecha: new Date(2024, 6, 1, 16), temperatura: 26 },
    { fecha: new Date(2024, 6, 1, 17), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 1, 18), temperatura: 25 },
    { fecha: new Date(2024, 6, 1, 19), temperatura: 24.5 },
    { fecha: new Date(2024, 6, 1, 20), temperatura: 24 },
    { fecha: new Date(2024, 6, 1, 21), temperatura: 23.5 },
    { fecha: new Date(2024, 6, 1, 22), temperatura: 23 },
    { fecha: new Date(2024, 6, 1, 23), temperatura: 22.5 },
    { fecha: new Date(2024, 6, 2, 0), temperatura: 22 },
    { fecha: new Date(2024, 6, 2, 1), temperatura: 21.5 },
    { fecha: new Date(2024, 6, 2, 2), temperatura: 21 },
    { fecha: new Date(2024, 6, 2, 3), temperatura: 20.5 },
    { fecha: new Date(2024, 6, 2, 4), temperatura: 20 },
    { fecha: new Date(2024, 6, 2, 5), temperatura: 19.5 },
    { fecha: new Date(2024, 6, 2, 6), temperatura: 19 },
    { fecha: new Date(2024, 6, 2, 7), temperatura: 19.2 },
    { fecha: new Date(2024, 6, 2, 8), temperatura: 20 },
    { fecha: new Date(2024, 6, 2, 9), temperatura: 21 },
    { fecha: new Date(2024, 6, 2, 10), temperatura: 22 },
    { fecha: new Date(2024, 6, 2, 11), temperatura: 23 },
    { fecha: new Date(2024, 6, 2, 12), temperatura: 24 },
    { fecha: new Date(2024, 6, 2, 13), temperatura: 25 },
    { fecha: new Date(2024, 6, 2, 14), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 2, 15), temperatura: 26 },
    { fecha: new Date(2024, 6, 2, 16), temperatura: 26.2 },
    { fecha: new Date(2024, 6, 2, 17), temperatura: 26 },
    { fecha: new Date(2024, 6, 2, 18), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 2, 19), temperatura: 25 },
    { fecha: new Date(2024, 6, 2, 20), temperatura: 24.5 },
    { fecha: new Date(2024, 6, 2, 21), temperatura: 24 },
    { fecha: new Date(2024, 6, 2, 22), temperatura: 23.5 },
    { fecha: new Date(2024, 6, 2, 23), temperatura: 23 },
    { fecha: new Date(2024, 6, 3, 0), temperatura: 22.5 },
    { fecha: new Date(2024, 6, 3, 1), temperatura: 22 },
    { fecha: new Date(2024, 6, 3, 2), temperatura: 21.5 },
    { fecha: new Date(2024, 6, 3, 3), temperatura: 21 },
    { fecha: new Date(2024, 6, 3, 4), temperatura: 20.5 },
    { fecha: new Date(2024, 6, 3, 5), temperatura: 20 },
    { fecha: new Date(2024, 6, 3, 6), temperatura: 19.5 },
    { fecha: new Date(2024, 6, 3, 7), temperatura: 19.2 },
    { fecha: new Date(2024, 6, 3, 8), temperatura: 20 },
    { fecha: new Date(2024, 6, 3, 9), temperatura: 21 },
    { fecha: new Date(2024, 6, 3, 10), temperatura: 22 },
    { fecha: new Date(2024, 6, 3, 11), temperatura: 23 },
    { fecha: new Date(2024, 6, 3, 12), temperatura: 24 },
    { fecha: new Date(2024, 6, 3, 13), temperatura: 25 },
    { fecha: new Date(2024, 6, 3, 14), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 3, 15), temperatura: 26 },
    { fecha: new Date(2024, 6, 3, 16), temperatura: 26.2 },
    { fecha: new Date(2024, 6, 3, 17), temperatura: 26 },
    { fecha: new Date(2024, 6, 3, 18), temperatura: 25.5 },
    { fecha: new Date(2024, 6, 3, 19), temperatura: 25 },
    { fecha: new Date(2024, 6, 3, 20), temperatura: 24.5 },
    { fecha: new Date(2024, 6, 3, 21), temperatura: 24 },
    { fecha: new Date(2024, 6, 3, 22), temperatura: 23.5 },
    { fecha: new Date(2024, 6, 3, 23), temperatura: 23 },
    { fecha: new Date(2024, 6, 4, 0), temperatura: 22.5 },
  ];
  return dataSource;
};

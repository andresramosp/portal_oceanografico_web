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
  if (sensorId != 196) {
    const response = await fetch(
      `${API_BASE_URL}/api/sensor/pathdata/${domain.id}?sourceId=${domain.sourceId}&sensorId=${sensorId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T00:00:00",
      latitude: 36.4,
      longitude: -6.2,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T01:00:00",
      latitude: 36.35,
      longitude: -6.15,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T02:00:00",
      latitude: 36.3,
      longitude: -6.1,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T03:00:00",
      latitude: 36.25,
      longitude: -6.05,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T04:00:00",
      latitude: 36.2,
      longitude: -6.0,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T05:00:00",
      latitude: 36.15,
      longitude: -5.95,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T06:00:00",
      latitude: 36.1,
      longitude: -5.9,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T07:00:00",
      latitude: 36.05,
      longitude: -5.85,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T07:30:00",
      latitude: 36.045,
      longitude: -5.84,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T08:00:00",
      latitude: 36.04,
      longitude: -5.83,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T08:30:00",
      latitude: 36.035,
      longitude: -5.82,
      speed: 0.0,
      variables: null,
    },
    // {
    //   receptionDateTime: null,
    //   positionDateTime: "2024-10-15T08:00:00",
    //   latitude: 36.0,
    //   longitude: -5.8,
    //   speed: 0.0,
    //   variables: null,
    // },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T09:00:00",
      latitude: 35.95,
      longitude: -5.76,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T10:00:00",
      latitude: 35.914776,
      longitude: -5.75684166,
      speed: 0.0,
      variables: null,
    },
  ];
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

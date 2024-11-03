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
    // Added points to the beginning of the trajectory

    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T20:00:00",
      latitude: 36.16,
      longitude: -6.66,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T21:00:00",
      latitude: 36.12,
      longitude: -6.62,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T22:00:00",
      latitude: 36.08,
      longitude: -6.58,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T23:00:00",
      latitude: 36.04,
      longitude: -6.54,
      speed: 0.0,
      variables: null,
    },
    // Original trajectory points
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T00:00:00",
      latitude: 36.0,
      longitude: -6.5,
      speed: 0.0,
      variables: null,
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T01:00:00",
      latitude: 35.98,
      longitude: -6.48,
      speed: 0.0,
      variables: null,
    },
    // Adjusted to create initial curve
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T02:00:00",
      latitude: 35.96,
      longitude: -6.45,
      speed: 0.0,
      variables: null,
    },
    // Moved slightly east and south
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T03:00:00",
      latitude: 35.94,
      longitude: -6.41,
      speed: 0.0,
      variables: null,
    },
    // Curving more towards the east
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T04:00:00",
      latitude: 35.92,
      longitude: -6.36,
      speed: 0.0,
      variables: null,
    },
    // Continuing the curve
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T05:00:00",
      latitude: 35.91,
      longitude: -6.3,
      speed: 0.0,
      variables: null,
    },
    // More pronounced curve
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T06:00:00",
      latitude: 35.9,
      longitude: -6.23,
      speed: 0.0,
      variables: null,
    },
    // Beginning to curve back north
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T07:00:00",
      latitude: 35.9,
      longitude: -6.16,
      speed: 0.0,
      variables: null,
    },
    // Continuing the northward curve
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T08:00:00",
      latitude: 35.91,
      longitude: -6.09,
      speed: 0.0,
      variables: null,
    },
    // Nearing the final point
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T09:00:00",
      latitude: 35.92,
      longitude: -6.02,
      speed: 0.0,
      variables: null,
    },
    // Final approach to the last point
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T10:00:00",
      latitude: 35.915,
      longitude: -5.88,
      speed: 0.0,
      variables: null,
    },
    // Last point remains intact
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T11:00:00",
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

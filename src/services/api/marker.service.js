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
      positionDateTime: "2024-10-14T20:00:00",
      latitude: 36.16,
      longitude: -6.66,
      speed: 0.0,
      variables: {
        water_temperature: 18.5,
        atm_temperature: 15.0,
        atm_pressure: 1012.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T21:00:00",
      latitude: 36.12,
      longitude: -6.62,
      speed: 0.0,
      variables: {
        water_temperature: 18.3,
        atm_temperature: 14.8,
        atm_pressure: 1012.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T22:00:00",
      latitude: 36.08,
      longitude: -6.58,
      speed: 0.0,
      variables: {
        water_temperature: 18.1,
        atm_temperature: 14.6,
        atm_pressure: 1013.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-14T23:00:00",
      latitude: 36.04,
      longitude: -6.54,
      speed: 0.0,
      variables: {
        water_temperature: 17.9,
        atm_temperature: 14.4,
        atm_pressure: 1013.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T00:00:00",
      latitude: 36.0,
      longitude: -6.5,
      speed: 0.0,
      variables: {
        water_temperature: 17.7,
        atm_temperature: 14.2,
        atm_pressure: 1014.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T01:00:00",
      latitude: 35.98,
      longitude: -6.48,
      speed: 0.0,
      variables: {
        water_temperature: 17.5,
        atm_temperature: 14.0,
        atm_pressure: 1014.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T02:00:00",
      latitude: 35.96,
      longitude: -6.45,
      speed: 0.0,
      variables: {
        water_temperature: 17.3,
        atm_temperature: 13.8,
        atm_pressure: 1015.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T03:00:00",
      latitude: 35.94,
      longitude: -6.41,
      speed: 0.0,
      variables: {
        water_temperature: 17.1,
        atm_temperature: 13.6,
        atm_pressure: 1015.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T04:00:00",
      latitude: 35.92,
      longitude: -6.36,
      speed: 0.0,
      variables: {
        water_temperature: 16.9,
        atm_temperature: 13.4,
        atm_pressure: 1016.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T05:00:00",
      latitude: 35.91,
      longitude: -6.3,
      speed: 0.0,
      variables: {
        water_temperature: 16.7,
        atm_temperature: 13.2,
        atm_pressure: 1016.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T06:00:00",
      latitude: 35.9,
      longitude: -6.23,
      speed: 0.0,
      variables: {
        water_temperature: 16.5,
        atm_temperature: 13.0,
        atm_pressure: 1017.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T07:00:00",
      latitude: 35.9,
      longitude: -6.16,
      speed: 0.0,
      variables: {
        water_temperature: 16.3,
        atm_temperature: 12.8,
        atm_pressure: 1017.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T08:00:00",
      latitude: 35.91,
      longitude: -6.09,
      speed: 0.0,
      variables: {
        water_temperature: 16.1,
        atm_temperature: 12.6,
        atm_pressure: 1018.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T09:00:00",
      latitude: 35.92,
      longitude: -6.02,
      speed: 0.0,
      variables: {
        water_temperature: 15.9,
        atm_temperature: 12.4,
        atm_pressure: 1018.5,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T10:00:00",
      latitude: 35.915,
      longitude: -5.88,
      speed: 0.0,
      variables: {
        water_temperature: 15.7,
        atm_temperature: 12.2,
        atm_pressure: 1019.0,
      },
    },
    {
      receptionDateTime: null,
      positionDateTime: "2024-10-15T11:00:00",
      latitude: 35.914776,
      longitude: -5.75684166,
      speed: 0.0,
      variables: {
        water_temperature: 15.5,
        atm_temperature: 12.0,
        atm_pressure: 1019.5,
      },
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

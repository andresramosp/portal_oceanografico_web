const API_BASE_URL = "http://localhost:8080";

export const generateImage = async (date, domain, variable, components) => {
  let response = await fetch(`${API_BASE_URL}/api/particles/generateImage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId: domain.sourceId,
      domainId: domain.id,
      date,
      variable,
      components,
      bounds: {
        // TODO
        viewS: null,
        viewW: null,
        viewN: null,
        viewE: null,
      },
    }),
  });
  response = await response.json();
  return response;
};

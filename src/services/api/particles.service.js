const API_BASE_URL = "http://localhost:8080";
export const getLayerForTime = async (date, domain, bounds, variableId) => {
  const response = await fetch(`${API_BASE_URL}/api/particles/data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sourceId: domain.sourceId,
      domainId: domain.id,
      date,
      variableId,
      bounds,
    }),
  });
  const blob = await response.blob();
  return blobToTextureData(blob);
};

const blobToTextureData = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8ClampedArray(arrayBuffer);
  const imageData = await createImageBitmap(blob);
  return {
    data: uint8Array,
    width: imageData.width,
    height: imageData.height,
  };
};

// export const getDateRange = async (domains) => {
//   const response = await fetch(`${API_BASE_URL}/api/particles/daterange`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       sourceId: domains[0].sourceId,
//       domainId: domains[0].id,
//     }),
//   });
//   return response.json();
// };

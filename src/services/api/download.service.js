const API_BASE_URL = "http://localhost:8080";

// export const downloadHeatmap = async (items) => {
//   let response = await fetch(`${API_BASE_URL}/api/download/heatmap`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(items),
//   });
//   response = await response.json();
//   return response;
// };

export const downloadHeatmap = (downloadItems) => {
  return fetch(`${API_BASE_URL}/api/download/heatmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Include other headers if necessary
    },
    body: JSON.stringify(downloadItems),
  }).then((response) => {
    if (response.ok) {
      return response.blob().then((blob) => ({
        data: blob,
        headers: {
          "content-disposition": response.headers.get("Content-Disposition"),
        },
      }));
    } else {
      throw new Error("Network response was not ok");
    }
  });
};

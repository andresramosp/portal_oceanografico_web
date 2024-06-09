import { WebMercatorViewport } from "@deck.gl/core";
import useMapState from "../states/MapState";

const getMapViewState = () => {
  const { viewState } = useMapState.getState();
  return viewState;
};

const GeodesicService = {
  getViewBounds() {
    const viewState = getMapViewState();
    const viewport = new WebMercatorViewport(viewState);

    const [west, south, east, north] = viewport.getBounds();

    return {
      viewW: west,
      viewS: south,
      viewE: east,
      viewN: north,
    };
  },

  haversineDistance(coord1, coord2) {
    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const lat1 = toRadians(coord1[1]);
    const lon1 = toRadians(coord1[0]);
    const lat2 = toRadians(coord2[1]);
    const lon2 = toRadians(coord2[0]);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Radio de la Tierra en kilómetros
    const R = 6371;

    return R * c;
  },
  distanceInPixels(coord1, coord2) {
    const viewState = getMapViewState();
    const viewport = new WebMercatorViewport(viewState);

    // Distancia en kilómetros usando la fórmula de Haversine
    const distanceKm = this.haversineDistance(coord1, coord2);

    // Coordenadas en píxeles de los puntos de referencia
    const pixelCoord1 = viewport.project(coord1);
    const pixelCoord2 = viewport.project(coord2);

    // Calcula la distancia en píxeles entre los puntos de referencia
    const deltaX = pixelCoord2[0] - pixelCoord1[0];
    const deltaY = pixelCoord2[1] - pixelCoord1[1];
    const pixelDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Calcula la relación de distancia en píxeles por kilómetro
    const refDistanceKm = this.haversineDistance(
      viewport.unproject([0, 0]),
      viewport.unproject([100, 0])
    );

    const pixelsPerKm = 100 / refDistanceKm;

    // Convierte la distancia de kilómetros a píxeles
    return distanceKm * pixelsPerKm;
  },

  getRadiusPixel(latStep, lonStep, bounds) {
    let numberOfPoints = 500;
    let radiusFactor = 2.8;
    let minRadius = 5.5;

    // Punto noroeste de la región cuadrada
    let nw = [bounds.viewW, bounds.viewN];

    // Calculamos otro punto desplazado según los pasos latitudinales y longitudinales
    let anotherPoint = [
      nw[0] + Math.abs(lonStep) * numberOfPoints,
      nw[1] - Math.abs(latStep) * numberOfPoints,
    ];

    // Calculamos la distancia en píxeles entre los dos puntos
    let distance = this.distanceInPixels(nw, anotherPoint);
    // console.log("distance ", distance);

    // Calculamos el tamaño de la celda y el radio
    let netcdfPixels =
      latStep !== 0 && lonStep !== 0
        ? Math.sqrt(Math.pow(numberOfPoints, 2) * 2)
        : numberOfPoints;
    let cellSizePx = distance / netcdfPixels;
    let radius = cellSizePx * radiusFactor;
    // if (radius < minRadius) radius = minRadius;

    console.log("radius ", radius);
    return radius;
  },
};

export default GeodesicService;

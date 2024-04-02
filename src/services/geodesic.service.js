import { WebMercatorViewport } from "@deck.gl/core";
import useMapState from "../states/MapState";

const getMapViewState = () => {
  const { viewState } = useMapState.getState();
  return viewState;
};

const GeodesicService = {
  distanceInPixels(coord1, coord2) {
    const viewState = getMapViewState();
    console.log("zoom ", viewState.zoom);
    const viewport = new WebMercatorViewport(viewState);

    const pixelCoord1 = viewport.project(coord1);
    const pixelCoord2 = viewport.project(coord2);

    const distance = Math.sqrt(
      Math.pow(pixelCoord2[0] - pixelCoord1[0], 2) +
        Math.pow(pixelCoord2[1] - pixelCoord1[1], 2)
    );

    return distance;
  },

  getRadiusPixel(latStep, lonStep, bounds) {
    let numberOfPoints = 10;
    let radiusFactor = 2.5;
    let minRadius = 5.5;

    // Punto noroeste de la región cuadrada
    let nw = [bounds.limW, bounds.limN];

    // Calculamos otro punto desplazado según los pasos latitudinales y longitudinales
    let anotherPoint = [
      nw[0] + Math.abs(lonStep) * numberOfPoints,
      nw[1] - Math.abs(latStep) * numberOfPoints,
    ];

    // Calculamos la distancia en píxeles entre los dos puntos
    let distance = this.distanceInPixels(nw, anotherPoint);
    console.log("distance ", distance);

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

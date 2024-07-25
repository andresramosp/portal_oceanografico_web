import { useState, useRef, useEffect } from "react";
import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import DeckGL from "@deck.gl/react";
import useMapState from "../states/MapState";
import * as d3 from "d3-ease";
import { IconLayer } from "@deck.gl/layers";

// Tu token de Mapbox
const MAPBOX_TOKEN = "TU_MAPBOX_TOKEN_AQUI";

// Coordenadas de las posiciones por las que se moverá el icono
const positions = [
  [-122.4, 37.8],
  [-122.41, 37.81],
  [-122.42, 37.82],
  [-122.43, 37.83],
  [-122.44, 37.84],
];

// Cargar la imagen del icono
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, anchorY: 128, mask: true },
};

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { viewState, mapStyle, setViewState } = useMapState();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % positions.length);
    }, 2000); // Cambiar cada 2 segundos
    return () => clearInterval(interval);
  }, []);

  const layers = [
    new IconLayer({
      id: "icon-layer",
      data: [
        {
          position: positions[currentIndex],
          icon: "marker",
          size: 50,
        },
      ],
      pickable: true,
      getIcon: (d) => ({
        url: "/boya.png",
        width: 128,
        height: 128,
      }),
      getSize: (d) => d.size,
      getPosition: (d) => d.position,
      transitions: {
        getPosition: {
          duration: 2000, // Duración de la transición en milisegundos
          easing: (d) => d3.easeCubicInOut(d), // Efecto de suavizado
        },
      },
    }),
  ];

  return (
    <DeckGL
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 12,
        pitch: 0,
        bearing: 0,
      }}
      controller={true}
      layers={layers}
    >
      <Map
        reuseMaps
        mapLib={maplibregl}
        mapStyle={mapStyle}
        preventStyleDiffing={true}
      />
    </DeckGL>
  );
};

export default App;

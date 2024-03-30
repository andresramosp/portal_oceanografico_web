import React, { useState, useEffect, createContext, useContext } from "react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { PlayingContext } from "./PlayingContext";
import PaletteService from "../services/palette.service";

const API_BASE_URL = "http://localhost:8080";

export const TimeLayersContext = createContext();

export const TimeLayersProvider = ({ children }) => {
  const [domains, setDomains] = useState([]);
  const [layers, setLayers] = useState([]);
  const [variable, setVariable] = useState("salinity");
  const radiusPixels = useRef(2);

  const { initPlayer, timeIndex, timeInterval, playing } =
    useContext(PlayingContext);

  const addDomain = async (domain) => {
    let newDomains = [...domains, domain];
    setDomains(newDomains);
    initPlayer(newDomains);
  };

  const getRadiusPixel = () => {
    // TODO
  };

  const getLayersForTime = async (timeIndex) => {
    console.log(timeInterval.current[timeIndex]);
    const newLayers = [];
    for (let domain of domains) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/heatmap/data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: domain.sourceId,
            domainId: domain.id,
            date: timeInterval.current[timeIndex],
            minValue: 26.45,
            maxValue: 37.43,
            variables: [variable],
            bounds: {
              viewS: null,
              viewW: null,
              viewN: null,
              viewE: null,
            },
            zoom: 8,
          }),
        });
        const { data } = await response.json();
        const heatmapLayer = new HeatmapLayer({
          data: data,
          id: "heatmap-layer",
          getPosition: (d) => [d[0], d[1]],
          getWeight: (d) => d[2],
          aggregation: "MEAN",
          radiusPixels,
          intensity: 1,
          threshold: 0.03,
          colorRange: PaletteService.getColorsDistribution(
            "cirana",
            [100],
            true
          ),
          colorDomain: [0, 100],
        });
        newLayers.push(heatmapLayer);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      setLayers(newLayers);
    }
  };

  return (
    <TimeLayersContext.Provider value={{ addDomain, layers, getLayersForTime }}>
      {children}
    </TimeLayersContext.Provider>
  );
};

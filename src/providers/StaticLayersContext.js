import React, { useState, useEffect, createContext } from "react";

export const StaticLayersContext = createContext();

export const StaticLayersProvider = ({ children }) => {
  const [layers, setLayers] = useState([]);

  return (
    <StaticLayersContext.Provider value={{ layers, setLayers }}>
      {children}
    </StaticLayersContext.Provider>
  );
};

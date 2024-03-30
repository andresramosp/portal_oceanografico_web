import React from "react";
import { createRoot } from "react-dom/client";

import { TimeLayersProvider } from "./providers/TimeLayersContext";
import { StaticLayersProvider } from "./providers/StaticLayersContext";

import { Player } from "./components/Player";
import DeckGLMap from "./components/DeckGLMap";
import "./App.css";
import MainMenu from "./components/MainMenu";
import menuItems from "./resources/menuItems";
import { PlayingProvider } from "./providers/PlayingContext";

export default function App() {
  return (
    <StaticLayersProvider>
      <PlayingProvider>
        <TimeLayersProvider>
          <MainMenu menuData={menuItems} />
          <Player />
          <DeckGLMap />
        </TimeLayersProvider>
      </PlayingProvider>
    </StaticLayersProvider>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}

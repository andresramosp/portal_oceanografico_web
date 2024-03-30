import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "./components/Player";
import DeckGLMap from "./components/DeckGLMap";
import "./App.css";
import MainMenu from "./components/MainMenu";
import menuItems from "./resources/menuItems";

export default function App() {
  return (
    <>
      <MainMenu menuData={menuItems} />
      <Player />
      <DeckGLMap />
    </>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}

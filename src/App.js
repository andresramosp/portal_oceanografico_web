import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "./components/Player";
import DeckGLMap from "./components/DeckGLMap";
import "./App.scss";
import MainMenu from "./components/MainMenu";
import { ConfigProvider } from "antd";
import { globalTheme, componentTheme } from "./themes/blueTheme";

export default function App() {
  return (
    <ConfigProvider theme={{ ...globalTheme, ...componentTheme }}>
      <MainMenu />
      <Player />
      <DeckGLMap />
    </ConfigProvider>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}

import React from "react";
import { createRoot } from "react-dom/client";
import { Player } from "./components/Player";
import DeckGLMap from "./components/DeckGLMap";
import "./App.css";
import MainMenu from "./components/MainMenu";
import { ConfigProvider } from "antd";

export default function App() {
  return (
    <ConfigProvider
      theme={{
        components: {
          Slider: {
            trackBg: "#1677ff",
            railBg: "#d9d9d9",
          },
        },
      }}
    >
      <MainMenu />
      <Player />
      <DeckGLMap />
    </ConfigProvider>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}

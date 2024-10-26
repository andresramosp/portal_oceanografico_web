import { DatePicker } from "antd";

// Configuración global
export const globalTheme = {
  token: {
    colorPrimary: "#005DFF",
    // colorTextBase: "white",
    fontFamily: "Arial, sans-serif",
    borderRadius: 0,
    fontFamily: "Proxima Nova, Arial, sans-serif",
    fontSize: 13,
    fontWeight: 800,
  },
};

// Configuración específica de componentes
export const componentTheme = {
  components: {
    Button: {
      colorBg: "#1890ff",
      borderRadius: 8,
    },
    Collapse: {
      headerBg: "#005DFF",
      padding: 20,
      borderRadius: 14,
      colorTextBase: "black",
    },
    Slider: {
      trackBg: "#1677ff",
      railBg: "#d9d9d9",
    },
    Spin: {
      colorTextBase: "white",
    },
    Player: {
      colorTextBase: "white",
    },
    Modal: {
      // colorBg: "#1890ff",
      // headerBg: "#005DFF",
      // colorTextBase: "white",
    },
  },
};

export const customClasses = {
  "--collapse-header-text-color": "white",
};

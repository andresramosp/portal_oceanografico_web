const Rainbow = require("rainbowvis.js");

const PaletteService = {
  PALETTES: [
    {
      paletteId: "cirana",
      rangeValues: { min: 0, max: 20 },
      step: 0.01,
      rgb: true,
      spectrum: [
        [223, 0, 255],
        [159, 0, 255],
        [95, 0, 255],
        [31, 0, 255],
        [0, 31, 255],
        [0, 95, 255],
        [0, 159, 255],
        [0, 223, 255],
        [0, 255, 223],
        [0, 255, 159],
        [0, 255, 95],
        [0, 255, 0],
        [95, 255, 0],
        [159, 255, 0],
        [207, 255, 0],
        [255, 255, 0],
        [255, 217, 0],
        [255, 159, 0],
        [255, 95, 0],
        [255, 31, 0],

        // [130, 17, 1],
        // [66, 9, 1],
        // [28, 3, 0],
      ],
    },
    {
      paletteId: "salinidad_ibi",
      rangeValues: { min: 0, max: 20 },
      step: 0.01,
      rgb: false,
      spectrum: [
        "#4c0154",
        "#5c0166",

        "#c81ddb",
        "#c81ddb",

        "#00008f",
        "#0000ff",
        "#006bff",
        "#00dbff",

        "#44e351",
        "#126631",
        "#0c401f",

        "#ffea00",
        "#fcf003",
        "#ff6700",

        "#f60000",
        "#8c0000",
        "#4a0101",
      ],
    },
    {
      paletteId: "temperature",
      rangeValues: { min: 0, max: 20 },
      step: 0.01,
      rgb: true,
      spectrum: [
        [255, 38, 255],
        [95, 7, 152],
        [22, 0, 154],
        [0, 0, 204],
        [0, 23, 253],
        [0, 118, 255],
        [0, 212, 255],
        [60, 247, 255],
        [147, 255, 255],
        [225, 255, 216],
        [255, 255, 61],
        [255, 234, 12],
        [255, 196, 0],
        [255, 153, 0],
        [255, 110, 0],
        [255, 68, 0],
        [255, 24, 0],
        [231, 5, 0],
        [193, 0, 0],
        [150, 0, 0],
      ],
    },
    {
      paletteId: "atmosfera",
      rangeValues: { min: 0, max: 20 },
      step: 0.1,
      spectrum: [
        "#0a246a",
        "#0002f5",
        "#0072ff",
        "#00f2ff",
        "#32ffa8",
        "#6fff43",
        "#fff900",
        "#ffa200",
        "#ff6d00",
        "#c20000",
        "#030000",
      ],
    },
    {
      paletteId: "wave_med",
      rangeValues: { min: 0, max: 6 },
      step: 0.1,
      spectrum: [
        "#0a246a",
        "#0002f5",
        "#0072ff",
        "#00f2ff",
        "#32ffa8",
        "#6fff43",
        "#fff900",
        "#ffa200",
        "#ff6d00",
        "#c20000",
        "#030000",
      ],
    },
    {
      paletteId: "wave_atl",
      rangeValues: { min: 0, max: 10 },
      step: 0.1,
      spectrum: [
        "#0a246a",
        "#0002f5",
        "#0072ff",
        "#00f2ff",
        "#32ffa8",
        "#6fff43",
        "#fff900",
        "#ffa200",
        "#ff6d00",
        "#c20000",
        "#030000",
      ],
    },
    {
      paletteId: "historic",
      rangeValues: { min: 0, max: 20 },
      step: 0.1,
      spectrum: [
        "#0a246a",
        "#0002f5",
        "#0072ff",
        "#00f2ff",
        "#32ffa8",
        "#6fff43",
        "#fff900",
        "#ffa200",
        "#ff6d00",
        "#c20000",
        "#9d0202",
      ],
    },
    {
      paletteId: "historic_blue",
      rangeValues: { min: 0, max: 20 },
      step: 0.1,
      spectrum: [
        "#9ccdfb",
        "#87c4fc",
        "#69b5fc",
        "#4aa7ff",
        "#2c97fc",
        "#1b90ff",
        "#0b88fc",
        "#007df3",
        "#0070da",
        "#0066c6",
      ],
    },
    {
      paletteId: "wms_rainbow",
      rangeValues: { min: 0, max: 20 },
      step: 0.1,
      spectrum: [
        "#00008f",
        "#0000ff",
        "#006bff",
        "#00dbff",
        "#47ffb7",
        "#b7ff47",
        "#ffd700",
        "#ff6700",
        "#f60000",
        "#8c0000",
      ],
    },
  ],

  PALETTES_VAR: {
    WAVE: "wave_atl",
    SEA_LEVEL: "wms_rainbow",
    WIND: "atmosfera",
    WATER_TEMP: "temperature",
    CURRENTS: "cirana",
    SALINITY: "cirana",
  },

  getPalette(paletteId) {
    let palette = structuredClone(
      this.PALETTES.find((p) => p.paletteId == paletteId)
    );
    if (palette.rgb) {
      palette.spectrum = palette.spectrum.map((color) => this.rgbToHex(color));
    }
    return palette;
  },

  getColor(paletteId, value, max) {
    let palette = this.getPalette(paletteId);
    if (max != null) {
      palette = { ...palette };
      palette.rangeValues.max = max;
    }
    var numberOfItems =
      (palette.rangeValues.max - palette.rangeValues.min) / palette.step;
    var position =
      ((value - palette.rangeValues.min) * numberOfItems) /
      palette.rangeValues.max;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum(...palette.spectrum);
    var color = rainbow.colourAt(position);
    return color;
  },

  hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    let result = [r, g, b, [1]];
    return result;
  },

  rgbToHex(rgb) {
    return (
      "#" +
      rgb
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  },

  getColorsDistribution(paletteId, distribution, convertoToRGB) {
    let palette = this.getColorsArray(paletteId, 0.01);
    let result = new Array();
    let segmentSize = Math.ceil(palette.length / distribution.length);
    let paletteSize = palette.length;
    for (let percent of distribution) {
      let numberColors = Math.floor((percent / 100) * paletteSize);
      if (numberColors < 2) {
        console.log("COLORS < 2");
        continue;
      }
      let colors = palette.splice(0, numberColors);
      var rainbow = new Rainbow();
      rainbow.setNumberRange(1, segmentSize);
      rainbow.setSpectrum(...colors);
      let segment = [];
      for (let position = 1; position <= segmentSize; position++) {
        var color = rainbow.colourAt(position);
        segment.push(convertoToRGB ? this.hexToRgb(color) : "#" + color);
      }
      result = result.concat(segment);
    }
    return result;
  },

  getColorsArray(paletteId, step, convertoToRGB) {
    let result = [];
    var palette = this.getPalette(paletteId);
    if (step != null) {
      palette = { ...palette };
      palette.step = step;
    }
    var numberOfItems =
      (palette.rangeValues.max - palette.rangeValues.min) / palette.step;
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numberOfItems);
    rainbow.setSpectrum(...palette.spectrum);
    for (let position = 1; position <= numberOfItems; position++) {
      var color = rainbow.colourAt(position);
      result.push(convertoToRGB ? this.hexToRgb(color) : "#" + color);
    }
    return result;
  },

  getColorDomain(paletteDistribution, histogramThreshold, minThresholdVar) {
    let minThreshold = 0;
    let maxThreshold = 100;
    if (paletteDistribution.length > 1) {
      let minAcc = 0;
      let i = 0;
      do {
        if (minAcc + paletteDistribution[i] < histogramThreshold) {
          minAcc += paletteDistribution[i];
          minThreshold += 100 / paletteDistribution.length;
        } else {
          let partialSegment = histogramThreshold - minAcc;
          minAcc += partialSegment;
          let percentSegment = (partialSegment * 100) / paletteDistribution[i];
          minThreshold += percentSegment / paletteDistribution.length;
        }

        i++;
      } while (minAcc < histogramThreshold);

      if (minThreshold < minThresholdVar) minThreshold = minThresholdVar;
    } else {
      minThreshold = minThresholdVar;
    }
    console.log("Color domain: ", minThreshold, maxThreshold);
    return [minThreshold, maxThreshold];
  },
};

export default PaletteService;

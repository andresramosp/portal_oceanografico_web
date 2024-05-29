import { create } from "zustand";
import { getDateRange as getHeatmapDateRange } from "../services/api/heatmap.service";
import { getDateRange as getTilemapDateRange } from "../services/api/tilemap.service";

export const usePlayingState = create((set, get) => ({
  domainType: "",
  timeIndex: -1,
  minDateFrom: null,
  maxDateFrom: null,
  dateFrom: null,
  dateTo: null,
  playing: false,
  paused: false,
  delay: 1500000,
  timeInterval: [],
  hourGap: 1,
  animationFrameId: null,
  animationFrameSetTimeoutId: null,

  setDomainType: (domainType) => set({ domainType }),
  setTimeIndex: (timeIndex) => set({ timeIndex }),
  setPlaying: (playing) => set({ playing }),
  setMinDateFrom: (minDateFrom) => set({ minDateFrom }),
  setMaxDateFrom: (maxDateFrom) => set({ maxDateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setHourGap: (hourGap) =>
    set((state) => {
      state.hourGap = hourGap;
    }),

  setPlayerInterval: async (domains) => {
    // Sacamos fecha max y min del conjunto de domimios (para los selects)
    const { minDate, maxDate } =
      get().domainType == "heatmap"
        ? await getHeatmapDateRange(domains)
        : await getTilemapDateRange(domains);
    get().setMinDateFrom(minDate);
    get().setMaxDateFrom(maxDate);
    // TODO: Establecemos reproduccion de ultima semana de ese rango
    get().setDateFrom(minDate);
    get().setDateTo(maxDate);

    // set({ timeIndex: -1 });
    get().getTimeIntervalArray();
  },

  togglePlaying: () => {
    if (!get().paused) {
      get().pause();
    } else {
      get().play();
    }
  },

  play: () => {
    set({ playing: true });
    set({ paused: false });
    const frameId = requestAnimationFrame(get().forward);
    set({ animationFrameId: frameId });
  },

  pause: () => {
    set({ paused: true });
    clearTimeout(get().animationFrameSetTimeoutId);
    cancelAnimationFrame(get().animationFrameId);
  },

  stop: () => {
    set({ playing: false });
    set({ paused: false });
    clearTimeout(get().animationFrameSetTimeoutId);
    cancelAnimationFrame(get().animationFrameId);
    get().setTimeIndex(-1);
  },

  forward: () => {
    set((state) => {
      const newIndex =
        state.timeIndex >= state.timeInterval.length - 1
          ? 0
          : state.timeIndex + 1;
      return { timeIndex: newIndex };
    });
    const timeoutId = setTimeout(() => {
      const frameId = requestAnimationFrame(get().forward);
      set({ animationFrameId: frameId });
    }, get().delay);
    set({ animationFrameSetTimeoutId: timeoutId });
  },

  getTimeIntervalArray: () => {
    let result = [];
    let currentDate = new Date(get().dateFrom);
    currentDate.setUTCHours(0, 0, 0, 0);
    let stopDate = new Date(get().dateTo);
    while (currentDate <= stopDate) {
      result.push(new Date(currentDate)); // Crear una nueva instancia de Date
      currentDate.setHours(currentDate.getHours() + get().hourGap);
    }

    set({ timeInterval: result.map((d) => d.toJSON()) });
    // console.log(result.map((d) => d.toJSON()));
  },
}));

// window.store = usePlayingState;

import { create } from "zustand";
import { getDateRange } from "../services/api/heatmap.service";

export const usePlayingState = create((set, get) => ({
  timeIndex: 0,
  minDateFrom: null,
  maxDateFrom: null,
  dateFrom: null,
  dateTo: null,
  playing: false,
  delay: 2000,
  timeInterval: [],
  hourGap: 1,
  animationFrameId: null,
  animationFrameSetTimeoutId: null,

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
    const { minDate, maxDate } = await getDateRange(domains);
    get().setMinDateFrom(minDate);
    get().setMaxDateFrom(maxDate);
    // TODO: Establecemos reproduccion de ultima semana de ese rango
    get().setDateFrom(minDate);
    get().setDateTo(maxDate);

    set({ timeIndex: 0 });
    get().getTimeIntervalArray();
  },

  initPlayer: () => {
    set({ playing: true });
    get().play();
  },

  togglePlaying: () => {
    set({ playing: !get().playing });
    if (get().playing) {
      get().play();
    } else {
      get().stop();
    }
  },

  play: () => {
    const timeoutId = setTimeout(() => {
      const frameId = requestAnimationFrame(get().forward);
      set({ animationFrameId: frameId });
    }, get().delay);
    set({ animationFrameSetTimeoutId: timeoutId });
  },

  stop: () => {
    clearTimeout(get().animationFrameSetTimeoutId);
    cancelAnimationFrame(get().animationFrameId);
  },

  forward: () => {
    set((state) => {
      const newIndex =
        state.timeIndex >= state.timeInterval.length - 1
          ? 0
          : state.timeIndex + 1;
      return { timeIndex: newIndex };
    });
    get().play();
  },

  getTimeIntervalArray: () => {
    let result = [];
    let currentDate = new Date(get().dateFrom);
    currentDate.setUTCHours(0, 0, 0, 0);
    let stopDate = new Date(get().dateTo);
    while (currentDate < stopDate) {
      result.push(new Date(currentDate)); // Crear una nueva instancia de Date
      currentDate.setHours(currentDate.getHours() + get().hourGap);
    }

    set({ timeInterval: result.map((d) => d.toJSON()) });
  },
}));

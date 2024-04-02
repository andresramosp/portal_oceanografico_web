import { create } from "zustand";

const API_BASE_URL = "http://localhost:8080";

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
  stop: () => {
    clearTimeout(get().animationFrameSetTimeoutId);
    cancelAnimationFrame(get().animationFrameId);
    set({ playing: false });
  },
  setMinDateFrom: (minDateFrom) => set({ minDateFrom }),
  setMaxDateFrom: (maxDateFrom) => set({ maxDateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setHourGap: (hourGap) =>
    set((state) => {
      state.hourGap = hourGap;
    }),

  setPlayerInterval: async (domains) => {
    const response = await fetch(`${API_BASE_URL}/api/heatmap/daterange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sourceId: domains[0].sourceId,
        domainId: domains[0].id,
      }),
    });
    // Sacamos fecha max y min del conjunto de domimios (para los selects)
    const { minDate, maxDate } = await response.json();
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

  play: () => {
    if (get().playing) {
      const timeoutId = setTimeout(() => {
        const frameId = requestAnimationFrame(get().forward);
        set({ animationFrameId: frameId });
      }, get().delay);
      set({ animationFrameSetTimeoutId: timeoutId });
    }
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

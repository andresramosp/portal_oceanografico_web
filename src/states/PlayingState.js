import { create } from "zustand";

export const usePlayingState = create((set, get) => ({
  timeIndex: 0,
  dateFrom: new Date("2024-03-21T00:00:00.000Z"),
  dateTo: new Date("2024-03-21T23:00:00.000Z"),
  playing: false,
  delay: 200,
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
  setDateFrom: (dateFrom) => set({ dateFrom }),
  setDateTo: (dateTo) => set({ dateTo }),
  setHourGap: (hourGap) =>
    set((state) => {
      state.hourGap = hourGap;
    }),

  initPlayer: (domains) => {
    // TODO: llamada getRange para dominios (como la antigua para multiples dominios)
    // TODO setDateTo, setDateFrom
    set({ timeIndex: 0 });
    get().getTimeIntervalArray(); // con dateFrom dateTo
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

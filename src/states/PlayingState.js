import { create } from "zustand";
import { getDateRange as getHeatmapDateRange } from "../services/api/heatmap.service";
import { getDateRange as getTilemapDateRange } from "../services/api/tilemap.service";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extender dayjs con los plugins necesarios
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

export const usePlayingState = create((set, get) => ({
  domainType: "",
  timeIndex: -1,
  minDateFrom: null, // dayjs o null
  maxDateTo: null, // dayjs o null
  dateFrom: null, // dayjs o null
  dateTo: null, // dayjs o null
  playing: false,
  paused: false,
  delay: 1500,
  timeInterval: [],
  hourGap: 1,
  animationFrameId: null,
  animationFrameSetTimeoutId: null,

  syncedWithPath: false,
  playingDomains: [], // uso exclusivo para recuperarlos tras el unsync de forma sencilla

  setDomainType: (domainType) => set({ domainType }),
  setTimeIndex: (timeIndex) => set({ timeIndex }),
  setPlaying: (playing) => set({ playing }),
  setPaused: (paused) => set({ paused }),

  setSyncedWithPath: (syncedWithPath) => set({ syncedWithPath }),
  setPlayingDomains: (playingDomains) => set({ playingDomains }),

  setMinDateFrom: (minDateFrom) =>
    set({ minDateFrom: minDateFrom ? dayjs(minDateFrom) : null }),
  setmaxDateTo: (maxDateTo) =>
    set({ maxDateTo: maxDateTo ? dayjs(maxDateTo) : null }),
  setDateFrom: (dateFrom) =>
    set({ dateFrom: dateFrom ? dayjs(dateFrom) : null }),
  setDateTo: (dateTo) => set({ dateTo: dateTo ? dayjs(dateTo) : null }),
  setHourGap: (hourGap) => set({ hourGap }),

  setPlayerInterval: async (domains) => {
    // Obtenemos las fechas mínimas y máximas del rango de dominios
    const { minDate, maxDate } =
      get().domainType === "heatmap"
        ? await getHeatmapDateRange(domains)
        : await getTilemapDateRange(domains);

    // Convertimos minDate y maxDate a objetos dayjs
    get().setMinDateFrom(minDate);
    get().setmaxDateTo(maxDate);

    // Establecemos dateFrom y dateTo
    // TODO: Establecemos reproduccion de ultima semana de ese rango
    get().setDateFrom(minDate);
    get().setDateTo(maxDate);

    // get().setTimeIndex(-1);
    get().getTimeIntervalArray();

    get().setPlayingDomains(domains);
  },

  syncWithPath: (pathArray, timeIndex) => {
    get().setSyncedWithPath(true);
    get().pause();

    let timeInterval = pathArray.map((d) => d.positionDateTime);

    get().setMinDateFrom(timeInterval[0]);
    get().setmaxDateTo(timeInterval[timeInterval.length - 1]);

    get().setDateFrom(timeInterval[0]);
    get().setDateTo(timeInterval[timeInterval.length - 1]);

    set({ timeInterval });
    get().setHourGap(1);
    get().setTimeIndex(timeIndex);
  },

  unSyncWithPath: () => {
    get().setSyncedWithPath(false);
    get().setPlayerInterval(get().playingDomains);
    get().setTimeIndex(0);
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

  setRange: (from, to) => {
    set({ dateFrom: from ? dayjs(from) : null });
    set({ dateTo: to ? dayjs(to) : null });
    set({ timeIndex: -1 });
    get().getTimeIntervalArray();
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
    let currentDate = get().dateFrom
      ? get().dateFrom.utc().startOf("hour")
      : null;
    let stopDate = get().dateTo ? get().dateTo.utc().endOf("hour") : null;

    if (!currentDate || !stopDate) {
      set({ timeInterval: [] });
      return;
    }

    while (currentDate.isSameOrBefore(stopDate)) {
      result.push(currentDate);
      currentDate = currentDate.add(get().hourGap, "hour");
    }

    // Convertimos los objetos dayjs a ISO strings
    set({ timeInterval: result.map((d) => d.toISOString()) });
  },
}));

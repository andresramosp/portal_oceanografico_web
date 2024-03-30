import React, { useState, useEffect, createContext, useRef } from "react";

export const PlayingContext = createContext();

export const PlayingProvider = ({ children }) => {
  const [timeIndex, setTimeIndex] = useState(0);
  const [dateFrom, setDateFrom] = useState(
    new Date("2024-03-21T00:00:00.000Z")
  );
  const [dateTo, setDateTo] = useState(new Date("2024-03-21T23:00:00.000Z"));
  const [playing, setPlaying] = useState(false);
  const timeInterval = useRef([]);
  const hourGap = useRef(5);

  const [animationFrameId, setAnimationFrameId] = useState(null);
  const [animationFrameSetTimeoutId, setAnimationFrameSetTimeoutId] =
    useState(null);

  const initPlayer = (domains) => {
    // TODO: llamada getRange para dominios (como la antigua para multiples dominios)
    // TODO setDateTo, setDateFrom
    setTimeIndex(0);
    getTimeIntervalArray(); // con dateFrom dateTo
    setPlaying(true);
  };

  const play = () => {
    if (playing) {
      const timeoutId = setTimeout(() => {
        const frameId = requestAnimationFrame(forward);
        setAnimationFrameId(frameId);
      }, 1000);
      setAnimationFrameSetTimeoutId(timeoutId);
    }
  };

  const forward = () => {
    setTimeIndex((prev) => {
      if (prev >= timeInterval.current.length - 1) {
        return 0;
      } else {
        return prev + 1;
      }
    });
    play();
  };

  const getTimeIntervalArray = () => {
    let result = [];
    let currentDate = new Date(dateFrom);
    currentDate.setUTCHours(0, 0, 0, 0);
    let stopDate = new Date(dateTo);

    while (currentDate < stopDate) {
      result.push(new Date(currentDate)); // Crear una nueva instancia de Date
      currentDate.setHours(currentDate.getHours() + hourGap.current);
    }

    timeInterval.current = result.map((d) => d.toJSON());
  };

  const setHourGap = (value) => {
    hourGap.current = value;
  };

  useEffect(() => {
    if (playing) play();
  }, [playing]);

  useEffect(() => {
    return () => {
      clearTimeout(animationFrameSetTimeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationFrameSetTimeoutId, animationFrameId]);

  useEffect(() => {
    if (!playing) {
      clearTimeout(animationFrameSetTimeoutId);
      cancelAnimationFrame(animationFrameId);
    }
  }, [playing]);

  return (
    <PlayingContext.Provider
      value={{
        setTimeIndex,
        timeIndex,
        playing,
        initPlayer,
        setHourGap,
        timeInterval,
      }}
    >
      {children}
    </PlayingContext.Provider>
  );
};

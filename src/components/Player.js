import React, { useEffect } from "react";
import "../styles/player.css";
import { useTimeLayersState } from "../states/TimeLayersState";
import { usePlayingState } from "../states/PlayingState";

export const Player = () => {
  const { timeIndex, setTimeIndex, playing, timeInterval } = usePlayingState(
    (state) => ({
      timeIndex: state.timeIndex,
      setTimeIndex: state.timeIndex,
      playing: state.playing,
      timeInterval: state.timeInterval,
    })
  );

  const { getLayersForTime } = useTimeLayersState((state) => ({
    getLayersForTime: state.getLayersForTime,
  }));

  useEffect(() => {
    if (playing) getLayersForTime(timeInterval[timeIndex]);
  }, [timeIndex]);

  return (
    <>
      {playing && (
        <div className="player-container">
          <input
            type="range"
            min="0"
            max="23"
            value={timeIndex}
            onChange={(e) => setTimeIndex(e.target.value)}
          />
        </div>
      )}
    </>
  );
};

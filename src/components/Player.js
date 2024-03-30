import React, { useContext, useEffect } from "react";
import "../styles/player.css";
import { PlayingContext } from "../providers/PlayingContext";
import { TimeLayersContext } from "../providers/TimeLayersContext";

export const Player = () => {
  const { timeIndex, setTimeIndex, playing } = useContext(PlayingContext);
  const { getLayersForTime } = useContext(TimeLayersContext);

  useEffect(() => {
    if (playing) getLayersForTime(timeIndex);
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

import React, { useEffect } from "react";
import "../styles/player.css";
import { useTimeLayersState } from "../states/TimeLayersState";
import { usePlayingState } from "../states/PlayingState";

export const Player = () => {
  const {
    timeIndex,
    setTimeIndex,
    playing,
    timeInterval,
    initPlayer,
    setPlayerInterval,
  } = usePlayingState((state) => ({
    timeIndex: state.timeIndex,
    setTimeIndex: state.timeIndex,
    playing: state.playing,
    timeInterval: state.timeInterval,
    initPlayer: state.initPlayer,
    setPlayerInterval: state.setPlayerInterval,
  }));

  const { getLayersForTime, domains, setPalette } = useTimeLayersState(
    (state) => ({
      getLayersForTime: state.getLayersForTime,
      domains: state.domains,
      setPalette: state.setPalette,
    })
  );

  const initPlaying = async (domains) => {
    await Promise.all([setPlayerInterval(domains), setPalette()]);
    initPlayer();
  };

  useEffect(() => {
    if (domains.length) initPlaying(domains);
  }, [domains]);

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

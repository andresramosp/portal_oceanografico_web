import React, { useEffect, useState } from "react";
import { Slider, Button, DatePicker, Space } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import "../styles/player.css";
import { useTimeLayersState } from "../states/TimeLayersState";
import { usePlayingState } from "../states/PlayingState";
import useMapState from "../states/MapState";

export const Player = () => {
  const [showPlayer, setShowPlayer] = useState(false);

  const { viewState } = useMapState((state) => ({
    viewState: state.viewState,
    mapStyle: state.mapStyle,
    setViewState: state.setViewState,
  }));

  const {
    timeIndex,
    setTimeIndex,
    playing,
    togglePlaying,
    timeInterval,
    initPlayer,
    setPlayerInterval,
    dateRange,
  } = usePlayingState((state) => ({ ...state }));

  const { getLayersForTime, domains, setPalette } = useTimeLayersState(
    (state) => ({
      getLayersForTime: state.getLayersForTime,
      domains: state.domains,
      setPalette: state.setPalette,
    })
  );

  useEffect(() => {
    if (domains.length) {
      setShowPlayer(true);
    } else {
      setShowPlayer(false);
    }
  }, [domains]);

  const initPlaying = async (domains) => {
    await Promise.all([setPlayerInterval(domains), setPalette()]);
    initPlayer();
  };

  const handleDateChange = (dates) => {
    // setDateRange(dates);
  };

  useEffect(() => {
    if (domains.length) initPlaying(domains);
  }, [domains]);

  useEffect(() => {
    if (playing) getLayersForTime(timeInterval[timeIndex]);
  }, [timeIndex]);

  useEffect(() => {
    if (!playing) {
      getLayersForTime(timeInterval[timeIndex]);
    }
  }, [viewState.zoom]);

  return showPlayer ? (
    <div
      className="player-container"
      style={{ background: "blue", padding: "10px" }}
    >
      <Space direction="vertical">
        <Slider
          min={0}
          max={23}
          value={timeIndex}
          onChange={setTimeIndex}
          style={{ width: 200 }}
        />
        <Button
          type="primary"
          icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={togglePlaying}
        >
          {playing ? "Pause" : "Play"}
        </Button>
        <DatePicker.RangePicker value={dateRange} onChange={handleDateChange} />
      </Space>
    </div>
  ) : null;
};

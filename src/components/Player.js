import React, { useEffect, useState } from "react";
import { Slider, Button, DatePicker, Space } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import "../styles/player.css";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { usePlayingState } from "../states/PlayingState";
import useMapState from "../states/MapState";
import { useTilemapLayersState } from "../states/TilemapLayersState";

export const Player = () => {
  const [showPlayer, setShowPlayer] = useState(false);

  const { viewState } = useMapState();

  const {
    domainType,
    setDomainType,
    timeIndex,
    setTimeIndex,
    playing,
    togglePlaying,
    timeInterval,
    initPlayer,
    setPlayerInterval,
    dateRange,
    stop,
  } = usePlayingState();

  const {
    getLayersForTime: getHeatmapLayersForTime,
    domains: heatmapDomains,
    setPalette,
  } = useHeatmapLayersState();

  const { getLayersForTime: getTileLayersForTime, domains: tilemapDomains } =
    useTilemapLayersState();

  const handleDateChange = (dates) => {
    // setDateRange(dates);
  };

  const getLayersForTime = (timeIndex) => {
    let time = timeInterval[timeIndex];
    if (domainType == "tilemap") getTileLayersForTime(time);
    if (domainType == "heatmap") getHeatmapLayersForTime(time);
  };

  const initHeatmapPlayer = async (domains) => {
    setDomainType("heatmap");
    await Promise.all([setPlayerInterval(domains), setPalette()]);
    if (!playing) initPlayer();
  };

  const initTilemapPlayer = async (domains) => {
    setDomainType("tilemap");
    await setPlayerInterval(domains);
    if (!playing) initPlayer();
  };

  useEffect(() => {
    if (heatmapDomains.length) {
      initHeatmapPlayer(heatmapDomains);
      setShowPlayer(true);
    } else if (tilemapDomains.length) {
      initTilemapPlayer(tilemapDomains);
      setShowPlayer(true);
    } else {
      stop();
      setShowPlayer(false);
    }
  }, [heatmapDomains, tilemapDomains]);

  useEffect(() => {
    getLayersForTime(timeIndex);
  }, [timeIndex]);

  useEffect(() => {
    if (!playing) {
      getLayersForTime(timeIndex);
    }
  }, [viewState.zoom]);

  return showPlayer ? (
    <div className="player-container">
      <Space direction="vertical">
        <Slider
          min={0}
          max={23}
          value={timeIndex}
          onChange={setTimeIndex}
          style={{ width: "98%" }}
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

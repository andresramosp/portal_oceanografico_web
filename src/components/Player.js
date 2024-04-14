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
    play,
    setPlayerInterval,
    dateRange,
    stop,
    hourGap,
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
    if (!playing) play();
  };

  const initTilemapPlayer = async (domains) => {
    setDomainType("tilemap");
    await setPlayerInterval(domains);
    if (!playing) play();
  };

  const getDateString = (jsonDateStr) => {
    const date = new Date(jsonDateStr);
    return date
      .toLocaleDateString("es-ES", {
        timeZone: "UTC", // Asegura que la fecha/hora sea en UTC
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
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
    if (!playing && domainType == "heatmap") {
      getLayersForTime(timeIndex);
    }
  }, [viewState.zoom]);

  return showPlayer ? (
    <div className="player-container">
      <Space direction="vertical">
        <Slider
          min={0}
          max={timeInterval.length - 1}
          step={hourGap}
          value={timeIndex}
          onChange={setTimeIndex}
          style={{ width: "98%" }}
        />
        <div className="player-info">
          <Button
            type="primary"
            icon={playing ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlaying}
          >
            {playing ? "Pause" : "Play"}
          </Button>
          <span> {getDateString(timeInterval[timeIndex])}</span>
        </div>

        <DatePicker.RangePicker value={dateRange} onChange={handleDateChange} />
      </Space>
    </div>
  ) : null;
};

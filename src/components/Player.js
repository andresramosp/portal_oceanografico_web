import React, { useEffect, useState } from "react";
import { Slider, Button, DatePicker, Space } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import "../styles/player.css";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { usePlayingState } from "../states/PlayingState";
import useMapState from "../states/MapState";
import { useTilemapLayersState } from "../states/TilemapLayersState";
import { PlayerLegend } from "./PlayerLegend";
import { useParticlesLayersState } from "../states/ParticlesLayersState";
import debounce from "lodash.debounce";

export const Player = () => {
  const [showPlayer, setShowPlayer] = useState(false);

  const { viewState } = useMapState();

  const {
    setDomainType,
    timeIndex,
    setTimeIndex,
    playing,
    paused,
    togglePlaying,
    timeInterval,
    play,
    setPlayerInterval,
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

  const {
    getLayersForTime: getParticlesLayersForTime,
    domains: particlesDomains,
  } = useParticlesLayersState();

  const handleDateChange = (dates) => {
    // setDateRange(dates);
  };

  const getLayersForTime = (timeIndex) => {
    let time = timeInterval[timeIndex];
    if (tilemapDomains.length) getTileLayersForTime(time);
    if (heatmapDomains.length) getHeatmapLayersForTime(time);
    if (particlesDomains.length) getParticlesLayersForTime(time);
  };

  const initHeatmapPlayer = async (domains) => {
    setDomainType("heatmap");
    await setPlayerInterval(domains);
    await setPalette();
  };

  const initParticlesPlayer = async (domains) => {
    setDomainType("heatmap");
    await setPlayerInterval(domains);
  };

  const initTilemapPlayer = async (domains) => {
    setDomainType("tilemap");
    await setPlayerInterval(domains);
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

  const handleChangeDomains = async () => {
    if (
      !heatmapDomains.length &&
      !tilemapDomains.length &&
      !particlesDomains.length
    ) {
      stop();
      setShowPlayer(false);
      return;
    }
    if (heatmapDomains.length) {
      await initHeatmapPlayer(heatmapDomains);
    }
    if (tilemapDomains.length) {
      await initTilemapPlayer(tilemapDomains);
    }
    if (particlesDomains.length) {
      await initParticlesPlayer(particlesDomains);
    }
    setShowPlayer(true);
    if (!playing && !paused) {
      console.log("handleChangeDomains, play()");
      play();
    }
  };

  useEffect(() => {
    handleChangeDomains();
  }, [heatmapDomains, tilemapDomains, particlesDomains]);

  useEffect(() => {
    getLayersForTime(timeIndex);
  }, [timeIndex]);

  useEffect(() => {
    const debouncedGetLayers = debounce(() => {
      if (paused && heatmapDomains.length) {
        getLayersForTime(timeIndex);
      }
    }, 250);

    debouncedGetLayers();
    return () => debouncedGetLayers.cancel();
  }, [viewState.zoom, viewState.longitude]);

  return showPlayer ? (
    <div className="player-container">
      <PlayerLegend />
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
            icon={!paused ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={togglePlaying}
          >
            {!paused ? "Pause" : "Play"}
          </Button>
          <span> {getDateString(timeInterval[timeIndex])}</span>
        </div>

        <DatePicker.RangePicker onChange={handleDateChange} />
      </Space>
    </div>
  ) : null;
};

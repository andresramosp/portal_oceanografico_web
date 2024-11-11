import React, { useEffect, useState } from "react";
import { Slider, Button, DatePicker, Tooltip } from "antd";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CalendarOutlined,
  SettingOutlined,
  CloudDownloadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import "../styles/player.css";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { usePlayingState } from "../states/PlayingState";
import useMapState from "../states/MapState";
import { useTilemapLayersState } from "../states/TilemapLayersState";
import { PlayerLegend } from "./PlayerLegend";
import { useParticlesLayersState } from "../states/ParticlesLayersState";
import debounce from "lodash.debounce";
import { PlayerOptions } from "./PlayerOptions";
import { componentTheme } from "../themes/blueTheme";

const { Player: playerTheme } = componentTheme.components;

export const Player = () => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPlayerOptions, setShowPlayerOptions] = useState(false);
  const [isRangePickerOpen, setIsRangePickerOpen] = useState(false);

  const { viewState, setDownloadDialogVisible } = useMapState();

  const {
    setDomainType,
    timeIndex,
    setTimeIndex,
    dateFrom,
    dateTo,
    minDateFrom,
    maxDateTo,
    playing,
    paused,
    setPaused,
    togglePlaying,
    timeInterval,
    play,
    setPlayerInterval,
    stop,
    hourGap,
    setHourGap,
    setRange,
    syncedWithPath,
  } = usePlayingState();

  const {
    getLayersForTime: getHeatmapLayersForTime,
    domains: heatmapDomains,
    setPalette,
    variable,
  } = useHeatmapLayersState();

  const { getLayersForTime: getTileLayersForTime, domains: tilemapDomains } =
    useTilemapLayersState();

  const {
    getLayersForTime: getParticlesLayersForTime,
    domains: particlesDomains,
  } = useParticlesLayersState();

  const handleDateChange = (dates) => {
    setRange(dates[0].$d, dates[1].$d);
  };

  const getLayersForTime = (timeIndex) => {
    let time = timeInterval[timeIndex];
    if (tilemapDomains.length) getTileLayersForTime(time);
    if (heatmapDomains.length) getHeatmapLayersForTime(time);
    if (particlesDomains.length) getParticlesLayersForTime(time);
  };

  const initHeatmapPlayer = async (domains) => {
    setDomainType("heatmap");
    setHourGap(domains[0].hourGap);
    if (domains[0].hourGap && !syncedWithPath) await setPlayerInterval(domains);
    await setPalette();
  };

  const initParticlesPlayer = async (domains) => {
    setDomainType("heatmap");
    setHourGap(domains[0].hourGap);
    if (!syncedWithPath) await setPlayerInterval(domains);
  };

  const initTilemapPlayer = async (domains) => {
    setDomainType("tilemap");
    setHourGap(domains[0].hourGap);
    if (!syncedWithPath) await setPlayerInterval(domains);
  };

  const getDateString = (jsonDateStr) => {
    const date = new Date(jsonDateStr);
    return date
      .toLocaleDateString("es-ES", {
        timeZone: "UTC",
        day: "2-digit",
        year: "numeric",
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
    let hourGap;
    if (heatmapDomains.length) {
      await initHeatmapPlayer(heatmapDomains);
      hourGap = heatmapDomains[0].hourGap;
    }
    if (tilemapDomains.length) {
      await initTilemapPlayer(tilemapDomains);
      hourGap = tilemapDomains[0].hourGap;
    }
    if (particlesDomains.length) {
      await initParticlesPlayer(particlesDomains);
      hourGap = particlesDomains[0].hourGap;
    }
    setShowPlayer(true);

    if (hourGap == 0) {
      setTimeIndex(0);
      setPaused(true);
    } else if (!playing && !paused) {
      console.log("handleChangeDomains, play()");
      play();
    }
  };

  const disabledDate = (current) => {
    const minDate = minDateFrom ? minDateFrom.startOf("day") : null;
    const maxDate = maxDateTo ? maxDateTo.endOf("day") : null;

    if (!current) {
      return false;
    }

    const currentDate = current.startOf("day");

    if (minDate && currentDate.isBefore(minDate)) {
      return true;
    }
    if (maxDate && currentDate.isAfter(maxDate)) {
      return true;
    }

    return false;
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
      <div
        className="player-main-container"
        style={{
          width: hourGap !== 0 ? "75%" : "27%",
          gap: hourGap !== 0 ? "15px" : "0px",
        }}
      >
        <div className="buttons-container">
          <Button
            type="primary"
            style={{ borderRadius: "50px", width: 30, height: 30 }}
            icon={<CloudDownloadOutlined style={{ fontSize: 24 }} />}
            onClick={() => setDownloadDialogVisible(true)}
          ></Button>
          {hourGap !== 0 && (
            <Tooltip title={syncedWithPath ? "Sincronizado con boya" : ""}>
              {" "}
              <Button
                type="primary"
                style={{ borderRadius: "50px", width: 30, height: 30 }}
                icon={
                  syncedWithPath ? (
                    <SyncOutlined style={{ color: "red" }} />
                  ) : !paused ? (
                    <PauseCircleOutlined style={{ fontSize: 24 }} />
                  ) : (
                    <PlayCircleOutlined style={{ fontSize: 24 }} />
                  )
                }
                onClick={togglePlaying}
                disabled={syncedWithPath}
              ></Button>
            </Tooltip>
          )}
        </div>
        <div style={{ width: "97%" }}>
          <div className="legend-container">{variable && <PlayerLegend />}</div>
          {hourGap !== 0 && (
            <div className="controls-container">
              <div style={{ width: "100%" }}>
                <Slider
                  min={0}
                  max={timeInterval.length - 1}
                  step={hourGap}
                  value={timeIndex}
                  onChange={setTimeIndex}
                  style={{ width: "100%" }}
                  disabled={syncedWithPath}
                  tooltip={{
                    formatter: (value) =>
                      getDateString(timeInterval[timeIndex]),
                  }}
                />
                <div className="date-labels-container">
                  <span
                    style={{
                      color: playerTheme.colorTextBase,
                      fontSize: "12px",
                    }}
                  >
                    {getDateString(dateFrom)}
                  </span>
                  <span
                    style={{
                      color: playerTheme.colorTextBase,
                      textAlign: "center",
                      fontSize: "14px",
                    }}
                  >
                    {getDateString(timeInterval[timeIndex])}
                  </span>
                  <span
                    style={{
                      color: playerTheme.colorTextBase,
                      fontSize: "12px",
                    }}
                  >
                    {getDateString(dateTo)}
                  </span>
                </div>
              </div>
              {/* Hidden RangePicker */}
              <DatePicker.RangePicker
                disabled={syncedWithPath}
                value={[dateFrom, dateTo]}
                onChange={handleDateChange}
                disabledDate={disabledDate}
                open={isRangePickerOpen}
                onOpenChange={(open) => setIsRangePickerOpen(open)}
                popupClassName="custom-calendar-popup"
                popupStyle={{ fontSize: "12px" }}
              />
            </div>
          )}
        </div>
        {hourGap !== 0 && (
          <div className="buttons-container">
            <Button
              type="primary"
              style={{ borderRadius: "50px", width: 27, height: 27 }}
              icon={<SettingOutlined style={{ fontSize: 17 }} />}
              onClick={() => setShowPlayerOptions(true)}
            ></Button>
            <Button
              type="text"
              style={{
                borderRadius: "50px",
                width: 27,
                height: 27,
                backgroundColor: "white",
              }}
              icon={
                <CalendarOutlined style={{ color: "black", fontSize: 17 }} />
              }
              onClick={() => setIsRangePickerOpen(true)}
            ></Button>
          </div>
        )}
      </div>
      <div style={{ width: "10%" }}>
        {/* {showPlayerOptions && <PlayerOptions />} */}
      </div>
    </div>
  ) : null;
};

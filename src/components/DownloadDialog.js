import React, { useState } from "react";
import { Modal, Card, DatePicker, Select, Button, Spin } from "antd";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { usePlayingState } from "../states/PlayingState";
import { downloadHeatmap } from "../services/api/download.service";
import { componentTheme } from "../themes/blueTheme";

const { Spin: spinTheme } = componentTheme.components;

const { RangePicker } = DatePicker;
const { Option } = Select;

const DownloadDialog = ({ visible, onCancel }) => {
  const [rangoFechas, setRangoFechas] = useState([]);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);
  const [loading, setLoading] = useState(false);

  const { domains } = useHeatmapLayersState();
  const { dateFrom, dateTo } = usePlayingState();

  const domainOptions = domains.map((domain) => {
    return { label: domain.name, value: domain.id };
  });

  const onChangeFecha = (fechas, formatoFechas) => {
    setRangoFechas(fechas);
  };

  const onChangeSelect = (valor) => {
    setItemsSeleccionados(valor);
  };

  const processZip = (zipData, contentDisposition) => {
    // Create a Blob from the ZIP data
    const blob = new Blob([zipData], { type: "application/zip" });

    // Default filename
    let filename = "download.zip";

    // Extract filename from Content-Disposition header if available
    if (contentDisposition && contentDisposition.includes("filename=")) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch != null && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Create a link element and trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  };

  const onDownload = async () => {
    if (!itemsSeleccionados.length) {
      return;
    }
    let downloadItems = [];
    for (let domainId of itemsSeleccionados) {
      let domain = domains.find((d) => d.id == domainId);
      downloadItems.push({
        from: dateFrom.$d,
        to: dateTo.$d,
        sourceId: domain.sourceId,
        domainId,
        variables: [],
      });
    }
    try {
      setLoading(true);
      let result = await downloadHeatmap(downloadItems);

      const zipData = result.data;
      const contentDisposition = result.headers["content-disposition"];

      processZip(zipData, contentDisposition);
      setLoading(false);
      onCancel();
    } catch (error) {
      console.error("Download failed.", error);
    }
  };

  return (
    <>
      <Modal
        title="Descarga de Datos Ráster"
        open={visible}
        onCancel={onCancel}
        onOk={onDownload}
      >
        <RangePicker
          value={[dateFrom, dateTo]}
          onChange={onChangeFecha}
          style={{ width: "100%", marginBottom: 16 }}
        />
        <Select
          mode="multiple"
          placeholder="Seleccione dominios"
          onChange={onChangeSelect}
          style={{ width: "100%" }}
          options={domainOptions}
        ></Select>

        {loading && (
          <Spin tip="Descargando ficheros..." size="large" spinning={true}>
            <div
              style={{
                padding: 30,
                background: "rgba(0, 0, 0, 0.05)",
                borderRadius: 4,
              }}
            />
            ;
          </Spin>
        )}
      </Modal>
    </>
  );
};

export default DownloadDialog;

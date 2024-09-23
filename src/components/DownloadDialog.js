import React, { useState } from "react";
import { Modal, Card, DatePicker, Select, Button } from "antd";
import { useHeatmapLayersState } from "../states/HeatmapLayersState";
import { usePlayingState } from "../states/PlayingState";
import { downloadHeatmap } from "../services/api/download.service";

const { RangePicker } = DatePicker;
const { Option } = Select;

const DownloadDialog = ({ visible, onCancel }) => {
  const [rangoFechas, setRangoFechas] = useState([]);
  const [itemsSeleccionados, setItemsSeleccionados] = useState([]);

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
    let result = await downloadHeatmap(downloadItems);
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
      </Modal>
    </>
  );
};

export default DownloadDialog;

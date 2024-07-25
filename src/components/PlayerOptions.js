import React, { useEffect } from "react";
import { Button, Space } from "antd";
import { CalendarOutlined, SettingOutlined } from "@ant-design/icons";

export const PlayerOptions = () => {
  useEffect(() => {}, []);

  return (
    <div className="player-options-container">
      <div className="buttons-container">
        <Button
          type="primary"
          style={{ borderRadius: "50px", width: 27, height: 27 }}
          icon={<SettingOutlined style={{ fontSize: 17 }} />}
        ></Button>
        <Button
          type="text"
          style={{
            borderRadius: "50px",
            width: 27,
            height: 27,
            backgroundColor: "white",
          }}
          icon={<CalendarOutlined style={{ color: "black", fontSize: 17 }} />}
        ></Button>
      </div>
    </div>
  );
};

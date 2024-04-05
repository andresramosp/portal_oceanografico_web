import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";
import { useTimeLayersState } from "../states/TimeLayersState";
import { getDomains } from "../services/api/domain.service";
import "antd/dist/reset.css";
import "../styles/mainMenu.css";

const { Panel } = Collapse;

const MainMenu = ({ menuData }) => {
  return (
    <div className="mainMenu-container">
      <Collapse>
        {menuData.map((section, index) => (
          <Panel header={section.sectionName} key={index}>
            {section.options.map((option, index) => (
              <Option key={index} option={option} />
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

const Option = ({ option }) => {
  const { setDomains } = useTimeLayersState((state) => ({
    setDomains: state.setDomains,
  }));
  const [checked, setChecked] = useState(false);

  const onChangeOption = async (e) => {
    setChecked(e.target.checked); // Actualiza el estado del checkbox
    if (option.resourceType === "heatmap-layer") {
      if (e.target.checked) {
        const domains = await getDomains(option);
        setDomains(domains);
      } else {
        setDomains([]);
      }
    }
  };

  if (option.optionType === "actionable") {
    return (
      <Checkbox
        onChange={onChangeOption}
        value={option.variable}
        checked={checked}
      >
        {option.optionName}
      </Checkbox>
    );
  } else if (option.optionType === "dropdown") {
    return (
      <Collapse>
        <Panel header={option.optionName}>
          {option.options.map((subOption, index) => (
            <Option key={index} option={subOption} />
          ))}
        </Panel>
      </Collapse>
    );
  }
};

export default MainMenu;

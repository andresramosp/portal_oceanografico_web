import React from "react";
import { Collapse, Checkbox } from "antd";
import "antd/dist/reset.css";
import "../styles/mainMenu.scss";
import useMenuState from "../states/MenuState";
import { componentTheme, customClasses } from "../themes/blueTheme";

const { Collapse: collapseTheme } = componentTheme.components;

const { Panel } = Collapse;

const MainMenu = () => {
  const { menuItems } = useMenuState();
  return (
    <div className="mainMenu-container">
      <Collapse
        accordion
        style={{
          borderRadius: collapseTheme.borderRadius,
          fontWeight: "bold",
          ...customClasses,
        }}
      >
        {menuItems.map((section, index) => (
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
  const { setOptionValue } = useMenuState((state) => ({ ...state }));

  const onChangeOption = async (e) => {
    setOptionValue(option.id, !option.checked);
  };

  if (option.optionType === "actionable") {
    return (
      <div className="checkbox-option">
        <Checkbox
          style={{ color: collapseTheme.colorTextBase, fontWeight: 100 }}
          onChange={() => onChangeOption(option)}
          value={option.variable}
          checked={option.checked}
        >
          {option.optionName}
        </Checkbox>
      </div>
    );
  } else if (option.optionType === "dropdown") {
    return (
      <div style={{ color: collapseTheme.colorTextBase }}>
        <span style={{ fontWeight: "bold" }}>{option.optionName}</span>
        <div className="sub-panel-list">
          {option.options.map((subOption, index) => (
            <Option key={index} option={subOption} />
          ))}
        </div>
      </div>
    );
  }
};

export default MainMenu;

import React from "react";
import { Collapse } from "antd";
import "antd/dist/reset.css";
import "../styles/mainMenu.scss";
import useMenuState from "../states/MenuState";
import { componentTheme, customClasses } from "../themes/blueTheme";
import { variableIcons, otherIcons } from "../resources/menuIcons";

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

  const onChangeOption = () => {
    setOptionValue(option.id, !option.checked);
  };

  const IconComponent =
    variableIcons[option.variable] ||
    otherIcons[option.icon] ||
    otherIcons.default;

  if (option.optionType === "actionable") {
    return (
      <div
        className="checkbox-option"
        onClick={onChangeOption}
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
      >
        <IconComponent
          style={{ color: option.checked ? "blue" : "black" }}
          alt="Descripción del icono"
        />
        <span
          style={{
            marginLeft: "8px",
            color: collapseTheme.colorTextBase,
            fontWeight: 100,
          }}
        >
          {option.optionName}
        </span>
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

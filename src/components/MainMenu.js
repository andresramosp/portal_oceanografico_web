import React from "react";
import { Collapse, Checkbox } from "antd";
import "antd/dist/reset.css";
import "../styles/mainMenu.css";
import useMenuState from "../states/MenuState";

const { Panel } = Collapse;

const MainMenu = () => {
  const { menuItems } = useMenuState((state) => ({ ...state }));
  return (
    <div className="mainMenu-container">
      <Collapse>
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
      <Checkbox
        onChange={() => onChangeOption(option)}
        value={option.variable}
        checked={option.checked}
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

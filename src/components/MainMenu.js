import React, { useContext, useState } from "react";
import "../styles/mainMenu.css";
import { StaticLayersContext } from "../providers/StaticLayersContext";
import { TimeLayersContext } from "../providers/TimeLayersContext";

const MainMenu = ({ menuData }) => {
  return (
    <div className="mainMenu-container">
      {menuData.map((section, index) => (
        <Accordion key={index} section={section} />
      ))}
    </div>
  );
};

const Accordion = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="section-title" onClick={() => setIsOpen(!isOpen)}>
        {section.sectionName}
      </div>
      {isOpen && (
        <div>
          {section.options.map((option, index) => (
            <Option key={index} option={option} />
          ))}
        </div>
      )}
    </div>
  );
};

const Option = ({ option }) => {
  const { addDomain } = useContext(TimeLayersContext);
  const { addLayer } = useContext(StaticLayersContext);

  const API_BASE_URL = "http://localhost:8080";

  const getResource = async (option) => {
    if (option.resourceType === "heatmap-layer") {
      const response = await fetch(
        `${API_BASE_URL}/api/heatmap/domains?variable=${option.variable}&sourceId=${option.sourceId}`
      );
      const data = await response.json();
      for (let domain of data) {
        addDomain(domain);
      }
    }
  };

  if (option.optionType === "actionable") {
    return (
      <div className="option">
        <input
          type="checkbox"
          id={option.variable}
          onClick={() => getResource(option)}
        />
        <label htmlFor={option.variable}>{option.optionName}</label>
      </div>
    );
  } else if (option.optionType === "dropdown") {
    return <Dropdown options={option.options} optionName={option.optionName} />;
  }
};

const Dropdown = ({ options, optionName }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="option">
      <div className="dropdown-title" onClick={() => setIsOpen(!isOpen)}>
        {optionName} {isOpen ? "-" : "+"}
      </div>
      {isOpen && (
        <div>
          {options.map((option, index) => (
            <Option key={index} option={option} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainMenu;

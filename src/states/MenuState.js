import { create } from "zustand";
import menuItems from "../resources/menuItems";
import { getDomains } from "../services/api/domain.service";
import { useTimeLayersState } from "./TimeLayersState";

const useMenuState = create((set) => ({
  menuItems,
  setMenuItems: (menuItems) => set({ menuItems }),
  setOptionValue: async (optionId, value) => {
    let option;
    set((state) => {
      const updatedMenuItems = state.menuItems.map((section) => ({
        ...section,
        options: updateOptions(section.options, optionId, value),
      }));

      option = findOptionById(updatedMenuItems, optionId);
      return { menuItems: updatedMenuItems };
    });

    if (option) {
      if (value) {
        await activateOption(option);
      } else {
        await deactivateOption(option);
      }
    }
  },

  getActiveOptions: () => {
    const allOptions = menuItems.flatMap((section) =>
      flattenOptions(section.options)
    );
    return allOptions
      .filter((option) => option.checked)
      .map((option) => option.id);
  },
  isActive: (optionId) => {
    const allOptions = menuItems.flatMap((section) =>
      flattenOptions(section.options)
    );
    return allOptions.some(
      (option) => option.id === optionId && option.checked
    );
  },
  findOptionById: (optionId) => {},
}));

const { setDomains, setVariable } = useTimeLayersState.getState();

const updateOptions = (options, optionId, value) => {
  return options.map((option) => {
    if (option.id === optionId) {
      return { ...option, checked: value };
    } else if (option.optionType === "dropdown" && option.options) {
      return {
        ...option,
        options: updateOptions(option.options, optionId, value),
      };
    }
    return option;
  });
};

const flattenOptions = (options, flattened = []) => {
  options.forEach((option) => {
    if (option.optionType === "actionable") {
      flattened.push(option);
    } else if (option.optionType === "dropdown" && option.options) {
      flattenOptions(option.options, flattened);
    }
  });
  return flattened;
};

const activateOption = async (option) => {
  if (option.resourceType === "heatmap-layer") {
    // TODO manejo de logica para quitar opciones no compatibles (dos variables distintas nunca lo son en heatmaps),
    // y que los domains se añadan a los previos si los hay
    const domains = await getDomains(option);
    setVariable(option.variable);
    setDomains(domains);
  }
};

const deactivateOption = async (option) => {
  if (option.resourceType === "heatmap-layer") {
    // TODO manejo de logica para quitar solo dominios / layers de esta option
    setDomains([]);
  }
};

const findOptionById = (menuItems, optionId) => {
  const allOptions = menuItems.flatMap((section) =>
    flattenOptions(section.options)
  );
  return allOptions.find((option) => option.id === optionId);
};

export default useMenuState;

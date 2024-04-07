import { create } from "zustand";
import menuItems from "../resources/menuItems";
import { getDomains } from "../services/api/domain.service";
import { useTimeLayersState } from "./TimeLayersState";

const {
  addDomains: addTimeDomains,
  removeDomains: removeTimeDomains,
  setVariable,
} = useTimeLayersState.getState();

const useMenuState = create((set, get) => ({
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
        await get().activateOption(option);
      } else {
        await get().deactivateOption(option);
      }
    }
  },

  activateOption: async (option) => {
    // TODO: en realidad solo hay que desactivar si estoy poniendo un heatmap, las options heatmaps de otras vars
    // ver como saber si una option es heatmap (o mirar alguno de sus resources con una funcion isHeatMapOption...)
    let otherVarOptions = get()
      .getActiveOptions()
      .filter((opt) => opt.variable != option.variable);
    for (let otherOpt of otherVarOptions) {
      get().setOptionValue(otherOpt.id, false);
    }

    let { timeDomains, featureDomains } = await getDomains(option);
    if (timeDomains.length) {
      addTimeDomains(timeDomains);
      setVariable(option.variable);
    }

    // if (featureDomains.length) {
    //   addFeatureDomains(newDomains);
    // }
  },

  deactivateOption: async (option) => {
    removeTimeDomains(option.id);
    // removeFeatureDomains(option.id)
  },

  getActiveOptions: () => {
    const allOptions = get().menuItems.flatMap((section) =>
      flattenOptions(section.options)
    );
    return allOptions.filter((option) => option.checked);
  },
  isActive: (optionId) => {
    const allOptions = get().menuItems.flatMap((section) =>
      flattenOptions(section.options)
    );
    return allOptions.some(
      (option) => option.id === optionId && option.checked
    );
  },
  findOptionById: (optionId) => {},
}));

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

const findOptionById = (menuItems, optionId) => {
  const allOptions = menuItems.flatMap((section) =>
    flattenOptions(section.options)
  );
  return allOptions.find((option) => option.id === optionId);
};

export default useMenuState;

import { create } from "zustand";
import menuItems from "../resources/menuItems";
import { getDomains } from "../services/api/domain.service";
import { useHeatmapLayersState } from "./HeatmapLayersState";
import { useTilemapLayersState } from "./TilemapLayersState";
import { useGeoJSONLayersState } from "./GeoJSONLayersState";
import { useParticlesLayersState } from "./ParticlesLayersState";

const {
  addDomains: addHeatmapDomains,
  removeDomains: removeHeatmapDomains,
  setVariable: setHeatmapVariable,
} = useHeatmapLayersState.getState();

const {
  addDomains: addTilemapDomains,
  removeDomains: removeTilemapDomains,
  setVariable: setTilemapVariable,
} = useTilemapLayersState.getState();

const {
  addDomains: addParticlesDomains,
  removeDomains: removeParticlesDomains,
  setVariable: setParticlesVariable,
} = useParticlesLayersState.getState();

const { addDomains: addGeoJSONDomains, removeDomains: removeGeoJSONDomains } =
  useGeoJSONLayersState.getState();

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
    if (get().optionHasType(option, "heatmap")) {
      let otherHeatmapVarOptions = get()
        .getActiveOptions()
        .filter(
          (opt) =>
            get().optionHasType(opt, "heatmap") &&
            opt.variable != option.variable
        );
      for (let otherOpt of otherHeatmapVarOptions) {
        // console.log("desactivando ", otherOpt.optionName);
        get().setOptionValue(otherOpt.id, false);
      }
    }

    let { heatmapDomains, particlesDomains, tilemapDomains, geoJSONDomains } =
      await getDomains(option);
    if (heatmapDomains.length) {
      setHeatmapVariable(option.variable);
      addHeatmapDomains(heatmapDomains);
    }
    if (particlesDomains.length) {
      setParticlesVariable(option.variable);
      addParticlesDomains(particlesDomains);
    }
    if (tilemapDomains.length) {
      setTilemapVariable(option.variable);
      addTilemapDomains(tilemapDomains);
    }
    if (geoJSONDomains.length) {
      addGeoJSONDomains(geoJSONDomains);
    }
  },

  deactivateOption: async (option) => {
    removeHeatmapDomains(option.id);
    removeTilemapDomains(option.id);
    removeParticlesDomains(option.id);
    removeGeoJSONDomains(option.id);
  },

  optionHasType: (option, type) => {
    return option.mapResources.some((mr) => mr.resourceType == type);
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

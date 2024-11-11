// icons.js
import { ReactComponent as TemperatureIcon } from "../assets/temperature.svg";
import { ReactComponent as SalinityIcon } from "../assets/salinity.svg";
import { ReactComponent as WaveIcon } from "../assets/wave.svg";
import { ReactComponent as CurrentsIcon } from "../assets/currents.svg";
import { ReactComponent as DefaultIcon } from "../assets/default.svg";
import { ReactComponent as LagrangnianIcon } from "../assets/boya_lagrangniana.svg";
import { ReactComponent as EulerianIcon } from "../assets/boya_euleriana.svg";

// Importa otros iconos

export const variableIcons = {
  temperature: TemperatureIcon,
  thetao: TemperatureIcon,
  salinity: SalinityIcon,
  wave: WaveIcon,
  currents: CurrentsIcon,
};

export const otherIcons = {
  boya_lagrangniana: LagrangnianIcon,
  boya_euleriana: EulerianIcon,
  default: DefaultIcon,
};

// export default { variableIcons, otherIcons };

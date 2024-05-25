const variables = {
  currents: ["u", "v"],
};

export const getVariables = (variableName) => {
  return variables[variableName] || [variableName];
};

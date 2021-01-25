import _ from "lodash";
import traverse from "traverse";

export default (state, { data, fieldName, idx, list, path, type, value }) => {
  switch (type) {
    case "INITIAL":
      return data;
    case "UPDATE":
      const fieldPath =
        fieldName.constructor.name === "Array"
          ? [...path, ...fieldName]
          : [...path, fieldName];
      return _.chain(state)
        .set(fieldPath, value)
        .set([...path, "mutation"], true)
        .value();
    case "REMOVE":
      return _.set(state, path, [
        ...list.slice(0, idx),
        ...list.slice(idx + 1),
      ]);
    case "REMOVE_TRAVERSE":
      // Update any objects that have specified fieldName (e.g. patternId) w/ traverse
    default:
      return state;
  }
};

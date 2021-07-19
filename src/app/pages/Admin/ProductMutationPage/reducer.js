import _ from "lodash";
import traverse from "traverse";

export default (state, { data, fieldName, idx, list, newValue, oldValue, path, type, value }) => {
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
    case "UPDATE_TRAVERSE":
      traverse(state).forEach(function (val) {
        if (
          !!val &&
          val.constructor.name === "Object" &&
          Object.keys(val).includes(fieldName) &&
          val[fieldName] === oldValue
        ) {
          this.update({
            ...val,
            [fieldName]: newValue,
          });
        }
      });
      return state;
    case "REMOVE":
      return _.set(state, path, [
        ...list.slice(0, idx),
        ...list.slice(idx + 1),
      ]);
    case "REMOVE_TRAVERSE":
      return state;
    default:
      return state;
  }
};

import traverse from "traverse";
import { toSnakeCase } from "../../../../utils/case-helper";

const checkForErrors = (arr, fieldName, errorObj) =>
  arr.map((obj) =>
    obj[fieldName]
      ? obj
      : {
          ...obj,
          errors: [...(obj.errors || []), errorObj],
        }
  );

const cleanupErrors = (arr) =>
  traverse(arr).forEach(function (x) {
    this.path[this.path.length - 1] === "errors" && this.remove();
  });

const hasError = (arr, fieldName) => arr.some((obj) => !obj[fieldName]);

export const handleFormErrors = (arr, className, requiredFields) => {
  arr = cleanupErrors(arr);
  let hasErrors = false;
  requiredFields.forEach((fieldName) => {
    if (hasError(arr, fieldName)) {
      hasErrors = true;
      arr = checkForErrors(arr, fieldName, {
        error: "required",
        message: `${className} must have a ${fieldName}.`,
      });
    }
  });
  return { hasErrors, arr };
};

export const buildQuery = (arr, className) => {
  const query = arr.reduce((query, obj) => {
    if (obj.id.indexOf("tmp") === 0) {
      query += `${obj.name}:Create${className}(`;
      query += Object.entries(obj)
        .filter(([key]) => key !== "id")
        .map(([key, val]) => `${toSnakeCase(key)}:"${val}"`)
        .join(",");
      query += `){${Object.keys(obj).map(toSnakeCase).join(" ")}}`;
      return query;
    }
  }, "");
  return `mutation CreateTags{${query}}`;
};

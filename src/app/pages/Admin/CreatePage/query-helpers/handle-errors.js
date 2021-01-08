import traverse from "traverse";

export const checkForErrors = (arr, fieldName, errorObj) =>
  arr.map((obj) =>
    obj[fieldName]
      ? obj
      : {
          ...obj,
          errors: [...(obj.errors || []), errorObj],
        }
  );

export const cleanupErrors = (arr) =>
  traverse(arr).forEach(function (x) {
    this.path[this.path.length - 1] === "errors" && this.remove();
  });

export const hasError = (arr, fieldName) => arr.some((obj) => !obj[fieldName]);

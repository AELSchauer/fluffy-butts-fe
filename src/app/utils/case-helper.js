const matchWords = (str = "") =>
  str.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );

const titleWord = (w) => w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase();

// snake_case
const toSnakeCase = (str = "") => matchWords(str).join("_").toLowerCase();

// camelCase
const toCamelCase = (str = "") => {
  str = matchWords(str);
  return str[0].toLowerCase() + str.slice(1).map(titleWord).join("");
};

// kebab-case
const toKebabCase = (str = "") => matchWords(str).join("-").toLowerCase();

// PascalCase
const toPascalCase = (str = "") => matchWords(str).map(titleWord).join("");

// Title Case
const toTitleCase = (str = "") => matchWords(str).map(titleWord).join(" ");

// UPPER_SNAKE_CASE
const toUpperSnakeCase = (str = "") => matchWords(str).join("_").toUpperCase();

module.exports = {
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
  toTitleCase,
  toUpperSnakeCase,
};

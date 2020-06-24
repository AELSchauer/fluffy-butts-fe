const camelToKebabCase = (string) => {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

const camelToPascalCase = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

module.exports = {
  camelToKebabCase,
  camelToPascalCase
}
module.exports = ({ id, name, category, displayOrder }) => {
  const mutationParams = [
    `name:"${name}"`,
    `category:"${category}"`,
    displayOrder && `display_order:"${displayOrder}"`,
  ]
    .filter(Boolean)
    .join(" ");

  if (id.indexOf("tmp") > -1) {
    return `id${id}:CreateTag(${mutationParams}){id name category display_order}`;
  } else {
    return `id${id}:UpdateTag(id:"${id}" ${mutationParams}){id name category display_order}`;
  }
};

export default ({ id, name, displayOrder, details, brandId }) => {
  const commonFields = [
    `name:"${name}"`,
    `displayOrder:"${displayOrder}"`,
    details && `details:"${JSON.stringify(details).replace(/"/g, '\\"')}"`,
  ]
    .filter(Boolean)
    .join(" ");

  if (id.indexOf("tmp") > -1) {
    return `id${id}:CreateProduct(${commonFields} brand_id:"${brandId}"){id name}}"`;
  } else {
    return `id${id}:UpdateProduct(id:"${id}" ${commonFields}){id name}}"`;
  }
};

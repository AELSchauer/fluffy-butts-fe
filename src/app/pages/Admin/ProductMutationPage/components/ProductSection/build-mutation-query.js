export default ({ id, name, details, patternId, productLineId }) => {
  const mutationParams = [
    `name:"${name}"`,
    `pattern_id:"${patternId}"`,
    details && `details:"${JSON.stringify(details).replace(/"/g, '\\"')}"`,
  ]
    .filter(Boolean)
    .join(" ");

  if (id.indexOf("tmp") > -1) {
    return `id${id}:CreateProduct(${mutationParams} product_line_id:${productLineId}){id name}}"`;
  } else {
    return `id${id}:UpdateProduct(id:"${id}" ${mutationParams}){id name}}"`;
  }
};

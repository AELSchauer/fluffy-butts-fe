export default ({ id, name, brandId }) => {
  if (id.indexOf("tmp") > -1) {
    return `id${id}:CreatePattern(name:"${name}" brand_id:"${brandId}"){id name}}"`;
  } else {
    return `id${id}:UpdatePattern(id:"${id}" name:"${name}"){id name}}"`;
  }
};

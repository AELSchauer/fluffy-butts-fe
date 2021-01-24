export default ({ id, name }) => {
  if (id.indexOf("tmp") > -1) {
    return `id${id}:CreateBrand(name:"${name}"){id name}`;
  } else {
    return `id${id}:UpdateBrand(id:"${id}" name:"${name}"){id name}`;
  }
};

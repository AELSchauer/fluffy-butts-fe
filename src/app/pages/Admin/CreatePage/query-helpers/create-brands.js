import axios from "../../../../utils/axios";
import { checkForErrors, cleanupErrors, hasError } from "./handle-errors";

export default (brands) => {
  if (brands.every(({ id }) => id.indexOf("tmp") === -1)) {
    return brands;
  }

  brands = cleanupErrors(brands);

  let hasErrors = false;

  if (hasError(brands, "name")) {
    hasErrors = true;
    brands = checkForErrors(brands, "name", {
      error: "required",
      message: "Brand must have a name.",
    });
  }

  if (hasErrors) {
    return Promise.resolve(brands);
  }

  const query = [];
  query.push("mutation CreateBrands{");
  brands.forEach(({ id, name }) => {
    if (id.indexOf("tmp") === 0) {
      query.push(`${name}:CreateBrand(name:"${name}"){id name}`);
    }
  });
  query.push("}");

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDA5MDg0MCwiZXhwIjoxNjEwMTc3MjQwfQ.fCJurBRFBPtsSv8x8G1pK8XMnICCZ3r6funGWJl8WFo";
  return axios({
    method: "POST",
    url: "/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      query: query.join(""),
    },
  })
    .then(({ data: { data: createBrands, errors: requestErrors } = {} }) => {
      return brands.map((brand) => {
        return (
          createBrands[brand.name] || {
            ...brand,
            errors: requestErrors
              .filter(({ path: [brandName] }) => brandName === brand.name)
              .reduce(
                (errors, { message }) => {
                  switch (message) {
                    case 'duplicate key value violates unique constraint "brands_name_unique"':
                      errors.name.push({
                        error: "duplicate",
                        message: "Brand with that name already exists.",
                      });
                      break;
                    default:
                      break;
                  }
                  return errors;
                },
                { name: [] }
              ),
          }
        );
      });
    });
};

import axios from "../../../../utils/axios";
import { buildQuery, handleFormErrors } from "./helpers";

const className = "Brand";
const requiredFields = ["name"];

export default (brands) => {
  if (brands.every(({ id }) => id.indexOf("tmp") === -1)) {
    return brands;
  }

  var { hasErrors, arr: brands } = handleFormErrors(
    brands,
    className,
    requiredFields
  );

  if (hasErrors) {
    return Promise.resolve(brands);
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDA5MDg0MCwiZXhwIjoxNjEwMTc3MjQwfQ.fCJurBRFBPtsSv8x8G1pK8XMnICCZ3r6funGWJl8WFo";
  return axios({
    method: "POST",
    url: "/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      query: buildQuery(brands, className),
    },
  }).then(({ data: { data: createBrands, errors: requestErrors } = {} }) => {
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

import axios from "../../../../utils/axios";
import { checkForErrors, cleanupErrors, hasError } from "./handle-errors";

export default (brand) => {
  brand = cleanupErrors([brand]);

  let hasErrors = false;

  if (hasError(brand, "name")) {
    hasErrors = true;
    brand = checkForErrors(brand, "name", {
      error: "required",
      message: "Brand must have a name.",
    })[0];
  }

  if (hasErrors) {
    return Promise.resolve(brand);
  }

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDA4MDA4OSwiZXhwIjoxNjEwMTY2NDg5fQ.LUMrCMy8FgbqDWYJ5yG2pIVnBgJffWRmMOhWLe_Xvlc";
  return axios({
    method: "POST",
    url: "/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      query: `mutation{CreateBrand(name:"${brand.name}"){id name}}`,
    },
  }).then(
    ({ data: { data: { CreateBrand } = {}, errors: requestErrors = [] } }) => {
      const errors = requestErrors.reduce(
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
      );
      return {
        ...CreateBrand,
        errors: !!requestErrors.length ? { errors } : undefined,
      };
    }
  );
};

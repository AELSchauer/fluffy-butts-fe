import axios from "../../../../utils/axios";

const createBrand = (brand) => {
  if (!brand.name) {
    return Promise.resolve({
      ...brand,
      errors: {
        name: [
          {
            error: "required",
            message: "Brand must have a name",
          },
        ],
      },
    });
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

export default createBrand;

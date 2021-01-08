import axios from "axios";
import { deserialize } from "deserialize-json-api";
import traverse from "traverse";

const baseURLs = {
  development: "http://localhost:8000",
  test: "https://enigmatic-wildwood-23801.herokuapp.com/api/v1",
  production: "https://api-fluffy-butts.herokuapp.com/api/v1",
};

const axiosWrapper = axios.create({
  baseURL: baseURLs[process.env.NODE_ENV],
  responseType: "json",
  transformResponse: [
    function (data) {
      const travData = traverse(data);
      if (data !== null) {
        travData
          .paths()
          .forEach(
            (path) =>
              travData.get(path) === null && travData.set(path, undefined)
          );
        return deserialize(travData.value, { transformKeys: "camelCase" });
      }
      return;
    },
  ],
});

export default (args) =>
  axiosWrapper(args).then((response) => {
    if (
      response.data.errors &&
      response.data.errors.length &&
      response.data.errors.some(({ code }) => code >= 400)
    ) {
      return Promise.reject(
        response.data.errors.find(({ code }) => code >= 400).message
      );
    }
    return response;
  });

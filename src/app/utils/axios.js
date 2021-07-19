import axios from "axios";
import { deserialize } from "deserialize-json-api";
import traverse from "traverse";

const baseURLs = {
  development: "http://localhost:8000",
  test: "https://fluffy-butts-api.herokuapp.com/",
  production: "https://fluffy-butts-api.herokuapp.com/",
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
              (travData.get(path) === null ||
                travData.get(path) === "undefined") &&
              travData.set(path, undefined)
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

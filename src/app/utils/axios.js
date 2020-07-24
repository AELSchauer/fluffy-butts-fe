import axios from "axios";
import { deserialize } from "deserialize-json-api";
import traverse from "traverse";

const baseURLs = {
  development: "http://localhost:3000/api/v1",
  test: "https://enigmatic-wildwood-23801.herokuapp.com/api/v1",
  production: "https://api-fluffy-butts.herokuapp.com/api/v1",
};

export default axios.create({
  baseURL: baseURLs[process.env.NODE_ENV],
  responseType: "json",
  transformResponse: [
    function (data) {
      const travData = traverse(data);
      travData
        .paths()
        .forEach(
          (path) => travData.get(path) === null && travData.set(path, undefined)
        );
      return deserialize(travData.value, { transformKeys: "camelCase" });
    },
  ],
});

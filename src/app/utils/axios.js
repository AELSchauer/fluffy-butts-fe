import axios from "axios";
import { deserialize } from "deserialize-json-api";
import traverse from "traverse";

export default axios.create({
  baseURL: "http://localhost:3000/api/v1",
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

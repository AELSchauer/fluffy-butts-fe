import axios from "axios";
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
      return travData.value;
    },
  ],
});

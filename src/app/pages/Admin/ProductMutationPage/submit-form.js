import _ from "lodash";
import axios from "../../../utils/axios";
import buildBrandMutationQuery from "./components/BrandSection/build-mutation-query";
import buildPatternMutationQuery from "./components/PatternSection/build-mutation-query";
import buildTagMutationQuery from "./components/TagSection/build-mutation-query";

const submitRequest = (query) => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDc3NzUyOCwiZXhwIjoxNjEwODYzOTI4fQ.fBQwggWuTLiUZPkBgMbWW73rku3Os3VTFYUYKoRnwsk";
  return axios({
    method: "POST",
    url: "/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      query,
    },
  });
};

export default (rootData, onChange) => {
  const { brand, tags } = rootData;

  const mutatedTags = tags.filter(({ mutation }) => !!mutation);
  return (
    (!mutatedTags.length
      ? Promise.resolve()
      : submitRequest(
          `mutation MutateTags{${mutatedTags
            .map(buildTagMutationQuery)
            .join("")}}`
        )
    )
      .then(({ data: { data } = {} } = {}) => {
        data &&
          Object.entries(data).forEach(([qid, val]) => {
            const idx = tags.findIndex(
              ({ id }) => id === qid.replace("id", "")
            );
            !!~idx
              ? onChange(["tags", idx], {
                  ...val,
                  mutation: false,
                })
              : console.log("tags stuff.", qid.replace("id", ""));
          });

        return !brand.mutation
          ? Promise.resolve()
          : submitRequest(
              `mutation MutateBrand{${buildBrandMutationQuery(brand)}}`
            );
      })
      .then(({ data: { data } = {} } = {}) => {
        if (!!data) {
          const [[qid, val]] = Object.entries(data);
          if (brand.id === qid.replace("id", "")) {
            onChange(["brand"], {
              ...val,
              mutation: false,
            });
          } else {
            console.error("brand shit", qid);
          }
        }

        const patterns = brand.patterns || [];
        const mutatedPatterns = patterns
          .filter(({ mutation }) => !!mutation)
          .map((pattern) => ({ ...pattern, brandId: brand.id }));
        return !mutatedPatterns.length
          ? Promise.resolve()
          : submitRequest(
              `mutation MutatePatterns{${mutatedPatterns
                .map(buildPatternMutationQuery)
                .join("")}}`
            );
      })
      .then((response) => {
        console.log("patterns response", response);
      })
      .catch((err) => {
        console.error("err", err);
      })
  );
};

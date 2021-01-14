import _ from "lodash";
import axios from "../../../../utils/axios";
import { buildQuery, handleFormErrors } from "./helpers";

const className = "Tag";
const requiredFields = ["name", "category"];

export default (tags) => {
  if (tags.every(({ id }) => id.indexOf("tmp") === -1)) {
    return tags;
  }

  var { hasErrors, arr: tags } = handleFormErrors(
    tags,
    className,
    requiredFields
  );

  if (hasErrors) {
    return Promise.resolve(tags);
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
      query: buildQuery(tags, className),
    },
  }).then(({ data: { data: createTags, errors: requestErrors } = {} }) => {
    return tags.map((tag) => {
      return (
        createTags[tag.name] || {
          ...tag,
          errors: requestErrors
            .filter(({ path: [tagName] }) => tagName === tag.name)
            .reduce(
              (errors, { message }) => {
                switch (message) {
                  case 'duplicate key value violates unique constraint "tags_name_unique"':
                    errors.name.push({
                      error: "duplicate",
                      message: "Tag with that name already exists.",
                    });
                    break;
                  default:
                    console.error(
                      "handler for error message not found",
                      message
                    );
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

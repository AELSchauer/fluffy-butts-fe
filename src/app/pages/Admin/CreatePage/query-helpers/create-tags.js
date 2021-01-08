import _ from "lodash";
import axios from "../../../../utils/axios";
import { checkForErrors, cleanupErrors, hasError } from "./handle-errors";

export default (tags) => {
  tags = cleanupErrors(tags);

  let hasErrors = false;

  if (hasError(tags, "name")) {
    hasErrors = true;
    tags = checkForErrors(tags, "name", {
      error: "required",
      message: "Tag must have a name.",
    });
  }

  if (hasError(tags, "category")) {
    hasErrors = true;
    tags = checkForErrors(tags, "category", {
      error: "required",
      message: "Tag must have a category.",
    });
  }

  if (hasErrors) {
    return Promise.resolve(tags);
  }

  const query = [];

  query.push("mutation CreateTags{");
  tags.forEach(({ id, name, category, displayOrder }) => {
    if (id.indexOf("tmp") === 0) {
      const displayOrderQuery = displayOrder
        ? `,display_order:${displayOrder}`
        : "";
      const includeDisplayOrder = displayOrder ? " display_order" : "";
      query.push(
        `${name}:CreateTag(name:"${name}",category:"${category}"${displayOrderQuery}){id name category${includeDisplayOrder}}`
      );
    }
  });
  query.push("}");

  console.log(query.join(""));

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDA4MDA4OSwiZXhwIjoxNjEwMTY2NDg5fQ.LUMrCMy8FgbqDWYJ5yG2pIVnBgJffWRmMOhWLe_Xvlc";
  return axios({
    method: "POST",
    url: "/",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      query: query.join(""),
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
                    break;
                }
                return errors;
              },
              { name: [] }
            ),
        }
      );
    });
    return tags;
  });
};

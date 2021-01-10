const _ = require("lodash");

const response = {
  data: {
    data: {
      test4: {
        id: "118",
        name: "test4",
        category: "PATTERN__COLOR",
      },
      red: null,
    },
    errors: [
      {
        message:
          'duplicate key value violates unique constraint "tags_name_unique"',
        locations: [{ line: 1, column: 108 }],
        path: ["red"],
      },
    ],
  },
  status: 200,
  statusText: "OK",
  headers: { "content-length": "259", "content-type": "application/json" },
  config: {
    url: "/",
    method: "post",
    data:
      '{"query":"mutation CreateTags{test3:CreateTag(name:\\"test3\\",category:\\"PATTERN__COLOR\\"){id name category display_order}red:CreateTag(name:\\"red\\",category:\\"PATTERN__COLOR\\"){id name category display_order}}"}',
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=utf-8",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6ImJhbmFuYV9zcGxpdEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImJhbmFuYS1zcGxpdCIsImlhdCI6MTYxMDA4MDA4OSwiZXhwIjoxNjEwMTY2NDg5fQ.LUMrCMy8FgbqDWYJ5yG2pIVnBgJffWRmMOhWLe_Xvlc",
    },
    baseURL: "http://localhost:8000",
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    responseType: "json",
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
  },
  request: {},
};

const tags = [
  { id: "tmp-1610089099779", name: "test4", category: "PATTERN__COLOR" },
  { id: "tmp-1610089104634", name: "red", category: "PATTERN__COLOR" },
];

const woot = tags.map((tag) => {
  return (
    response.data.data[tag.name] || {
      ...tag,
      errors: response.data.errors
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
            return errors
          },
          { name: [] }
        ),
    }
  );
});

// const woot = _.entries(response.data.data).map(([tagName, tagData]) => {
//   return !!tagData ? tagData : tags.find(({ name }) => name === tagName);
// });

console.log(woot);
console.log(woot[1].errors);

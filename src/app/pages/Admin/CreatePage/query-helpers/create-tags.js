export default (tags) => {
  const body = [];

  if (tags.length === 1) {
    const [{ name, category, displayOrder }] = tags;
    const displayOrderQuery = displayOrder
      ? `,display_order:${displayOrder}`
      : "";
    body.push(
      `CreateTag(name:"${name}",category:"${category}"${displayOrderQuery}){id}`
    );
  } else if (tags.length > 1) {
    body.push("mutation CreateTags{");
    tags.forEach(({ name, category, displayOrder }) => {
      const displayOrderQuery = displayOrder
        ? `,display_order:${displayOrder}`
        : "";
      body.push(
        `${name}:(name:"${name}",category:"${category}"${displayOrderQuery}){id}`
      );
    });
    body.push("}")
  }

  return body.join("");
};

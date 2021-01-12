import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import ProductLine from "./ProductLineTest";
import "./_product-line.scss";

const ProductLineSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  const onAdd = () => {
    onChange(
      path,
      (_.get(rootData, path) || []).concat([
        { id: `tmp-${Date.now()}`, mutation: true },
      ])
    );
  };

  const onRemove = ({ id }, idx) => {
    (id.indexOf("tmp-") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeleteProductLine(id: "${id}") {
                  id
                }
              }
            `,
          },
        })
    ).then(() => {
      const productLines = _.get(rootData, path);
      onChange(path, [
        ...productLines.slice(0, idx),
        ...productLines.slice(idx + 1),
      ]);
    });
  };

  return (
    <div className="category-section">
      <CollapsibleSection
        id={"product-line-section"}
        label={<h5 className="category-name">Product Lines</h5>}
      >
        <div className="product-line-list">
          {productLines.map((productLine, idx) => (
            <ProductLine
              key={idx}
              onRemove={onRemove}
              onChange={onChange}
              productLine={productLine}
            />
          ))}
          <span
            className="add-product-line"
            onClick={onAdd}
            onKeyPress={(e) => {
              e.key === "Enter" && onAdd();
            }}
            tabIndex="0"
          >
            <i className="fas fa-plus" />
            <span>Add Product Line</span>
          </span>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default ProductLineSection;

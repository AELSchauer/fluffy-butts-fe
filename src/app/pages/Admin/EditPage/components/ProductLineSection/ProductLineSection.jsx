import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import ProductLine from "./ProductLine";
import "./_product-line.scss";

const ProductLineSection = ({
  onAdd,
  onRemove,
  onChange,
  productLines = [],
}) => {
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

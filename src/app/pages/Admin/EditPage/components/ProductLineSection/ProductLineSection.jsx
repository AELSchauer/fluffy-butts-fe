import React from "react";
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
      <div className="category-heading">
        <h5 className="category-name">Product Lines</h5>
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
      <div className="product-line-list">
        {productLines.map((productLine, idx) => (
          <ProductLine
            key={idx}
            onRemove={onRemove}
            onChange={onChange}
            productLine={productLine}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductLineSection;

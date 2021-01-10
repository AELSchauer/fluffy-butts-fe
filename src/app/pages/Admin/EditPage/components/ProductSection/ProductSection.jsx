import React from "react";
import CollapsibleSection from "../CollapsibleSection";
import Product from "./Product";

const ProductSection = ({ onAdd, onRemove, onChange, products = [] }) => {
  return (
    <CollapsibleSection
      id={"collapse-products-section"}
      label={<h6 className="category-name">Products</h6>}
    >
      <div className="product-list">
        {products.map((product, idx) => (
          <Product
            key={idx}
            onRemove={onRemove}
            onChange={onChange}
            product={product}
          />
        ))}
        <span
          className="add-product"
          onClick={onAdd}
          onKeyPress={(e) => {
            e.key === "Enter" && onAdd();
          }}
          tabIndex="0"
        >
          <i className="fas fa-plus" />
          <span>Add Product</span>
        </span>
      </div>
    </CollapsibleSection>
  );
};

export default ProductSection;

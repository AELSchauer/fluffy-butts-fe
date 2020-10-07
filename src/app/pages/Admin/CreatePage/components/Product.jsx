import React, { useState } from "react";

const CreateProduct = ({ allPatterns = [], deleteButton, idx, onRemove, onChange, product }) => {
  return (
    <React.Fragment>
      <div className="product row">
        <div
          data-toggle="collapse"
          data-target={`#collapse-product-${idx}`}
          aria-expanded="false"
          aria-controls={`collapse-product-${idx}`}
        >
          <i className="fas fa-caret-right" />
          <label>Name</label>
        </div>
        <input
          className="col-4"
          type="text"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value }, idx)}
        />
        <label>Pattern</label>
        <select
          className="col-4"
          value={product.pattern}
          onChange={(e) =>
            onChange({ ...product, pattern: e.target.value }, idx)
          }
        >
          {allPatterns.map(({ name }, idx) => (
            <option value={name}>{name}</option>
          ))}
        </select>
        {deleteButton ? (
          <i className="fas fa-minus" onClick={() => onRemove(idx)} />
        ) : (
          ""
        )}
      </div>
      <div className="collapse" id={`collapse-product-${idx}`}>
        {/* <h6 className="category-name">Products</h6>
        <div>
          <div className="product-list">
            {product.products.map((product, idx) => (
              <CreateProduct
                deleteButton={idx > 0 || product.length > 1}
                idx={idx}
                onRemove={removeProduct}
                onChange={changeProduct}
                product={product}
              />
            ))}
          </div>
        </div>
        <div
          className="row add-product"
          onClick={() => setProducts(products.concat({}))}
        >
          <i className="fas fa-plus" />
          <span>Add Another Product</span>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default CreateProduct;

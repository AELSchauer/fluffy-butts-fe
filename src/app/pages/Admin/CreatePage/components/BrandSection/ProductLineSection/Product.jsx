import React, { useContext } from "react";
import PatternContext from "../../../../../../contexts/pattern-context";

const CreateProduct = ({ idx, onRemove, onChange, product }) => {
  const { patterns } = useContext(PatternContext);

  return (
    <div>
      <span className="product col-12 info-display">
        <span
          data-toggle="collapse"
          data-target={`#collapse-product-${product.id}`}
          aria-expanded="false"
          aria-controls={`collapse-product-${product.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <label>ID</label>
        <input type="text" value={product.id} disabled />
        <label>Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => onChange({ ...product, name: e.target.value })}
        />
        <label>Pattern</label>
        <select
          value={
            patterns.map(({ name }) => name).includes(product.pattern)
              ? product.pattern
              : ""
          }
          onChange={(e) => onChange({ ...product, pattern: e.target.value })}
        >
          <option value="">Select an option</option>
          {patterns
            .filter(({ name }) => !!name)
            .map(({ name }, idx) => (
              <option key={idx} value={name}>
                {name}
              </option>
            ))}
        </select>
        <i
          className="fas fa-minus"
          onClick={() => onRemove(product)}
          onKeyPress={(e) => {
            e.key === "Enter" && onRemove(product);
          }}
          tabIndex="0"
        />
      </span>
      <div className="collapse" id={`collapse-product-${product.id}`}>
        Stuff Goes Here?
      </div>
    </div>
  );
};

export default CreateProduct;

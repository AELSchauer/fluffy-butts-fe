import React, { useState } from "react";
import CreateProduct from "./Product";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const sampleProductDetails = {
  sizing: [
    {
      name: "",
      weight: {
        max: [
          { num: 0, unit: "kg" },
          { num: 0, unit: "lb" },
        ],
        min: [
          { num: 0, unit: "kg" },
          { num: 0, unit: "lb" },
        ],
      },
      dimensions: {
        width: [
          { num: 0, unit: "in" },
          { num: 0, unit: "cm" },
        ],
        length: [
          { num: 0, unit: "in" },
          { num: 0, unit: "cm" },
        ],
      },
    },
  ],
  materials:
    "<ul><li>Outer: polyester TPU</li><li>Inner: suede cloth (100% polyester)</li><li>Insert(s): 1 x 3-layer microfiber (80% polyester, 20% polyamide) insert</li></ul>",
};

const CreateProductLine = ({
  deleteButton,
  idx,
  onRemove,
  onChange,
  productLine = {},
  allPatterns = []
}) => {
  const [products, setProducts] = useState([{}]);

  const changeProduct = (product, idx) => {
    const newProducts = [
      ...products.slice(0, idx),
      product,
      ...products.slice(idx + 1),
    ];
    setProducts(newProducts);
    onChange({ ...productLine, products: newProducts }, idx);
  };

  const removeProduct = (idx) => {
    const newProducts = [...products.slice(0, idx), ...products.slice(idx + 1)];
    setProducts(newProducts);
    onChange({ ...productLine, products: newProducts }, idx);
  };

  return (
    <React.Fragment>
      <div className="product-line row">
        <div
          data-toggle="collapse"
          data-target={`#collapse-product-line-${idx}`}
          aria-expanded="false"
          aria-controls={`collapse-product-line-${idx}`}
        >
          <i className="fas fa-caret-right" />
          <label>Name</label>
        </div>
        <input
          className="col-4"
          type="text"
          value={productLine.name}
          onChange={(e) =>
            onChange({ ...productLine, name: e.target.value }, idx)
          }
        />
        <label>Display Order</label>
        <input
          className="col-4"
          type="text"
          value={productLine.displayOrder}
          onChange={(e) =>
            onChange({ ...productLine, displayOrder: e.target.value }, idx)
          }
        />
        {deleteButton ? (
          <i className="fas fa-minus" onClick={() => onRemove(idx)} />
        ) : (
          ""
        )}
      </div>
      <div className="collapse" id={`collapse-product-line-${idx}`}>
        <label>Details</label>
        <JSONInput
          id="product-line-details"
          placeholder={sampleProductDetails}
          locale={locale}
          height="250px"
          value={productLine.details}
          onChange={(e) =>
            onChange({ ...productLine, details: e.target.value }, idx)
          }
        />
        <h6 className="category-name">Products</h6>
        <div>
          <div className="product-list">
            {products.map((product, idx) => (
              <CreateProduct
                deleteButton={idx > 0 || products.length > 1}
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default CreateProductLine;

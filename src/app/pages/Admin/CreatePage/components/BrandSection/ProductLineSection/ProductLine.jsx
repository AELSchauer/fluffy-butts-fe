import React, { useState } from "react";
import CreateProduct from "./Product";
import CreateTagging from "../Tagging";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import TagContext from "../../../../../../contexts/tag-context";
import _ from "lodash";

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

const CreateProductLine = ({ onRemove, onChange, productLine = {} }) => {
  const [products, setProducts] = useState(productLine.products || []);
  const [taggings, setTaggings] = useState(productLine.taggings || []);

  const addProduct = () => {
    setProducts(products.concat({ id: Date.now() }));
  };

  const changeProduct = (product) => {
    const idx = _.findIndex(products, { id: product.id });
    const newProducts = [
      ...products.slice(0, idx),
      product,
      ...products.slice(idx + 1),
    ];
    setProducts(newProducts);
    onChange({ ...productLine, products: newProducts });
  };

  const removeProduct = (product) => {
    const idx = _.findIndex(products, { id: product.id });
    const newProducts = [...products.slice(0, idx), ...products.slice(idx + 1)];
    setProducts(newProducts);
    onChange({ ...productLine, products: newProducts });
  };

  const addTagging = () => {
    setTaggings(taggings.concat({ id: Date.now() }));
  };

  const changeTagging = (tagging) => {
    const idx = _.findIndex(taggings, { id: tagging.id });
    const newTaggings = [
      ...taggings.slice(0, idx),
      tagging,
      ...taggings.slice(idx + 1),
    ];
    setTaggings(newTaggings);
    onChange({ ...productLine, taggings: newTaggings });
  };

  const removeTagging = (tagging) => {
    const idx = _.findIndex(taggings, { id: tagging.id });
    const newTaggings = [...taggings.slice(0, idx), ...taggings.slice(idx + 1)];
    setTaggings(newTaggings.length ? newTaggings : []);
    onChange({ ...productLine, taggings: newTaggings });
  };

  return (
    <div className="product-line">
      <div className="col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-product-line-${productLine.id}`}
          aria-expanded="false"
          aria-controls={`collapse-product-line-${productLine.id}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <label>ID</label>
        <input type="text" value={productLine.id} disabled />
        <label>Name</label>
        <input
          type="text"
          value={productLine.name}
          onChange={(e) => onChange({ ...productLine, name: e.target.value })}
        />
        <label>Display Order</label>
        <input
          type="text"
          value={productLine.displayOrder}
          onChange={(e) =>
            onChange({ ...productLine, displayOrder: e.target.value })
          }
        />
        <i className="fas fa-minus" onClick={() => onRemove(productLine)} />
      </div>
      <ul className="collapse" id={`collapse-product-line-${productLine.id}`}>
        <li>
          <label>Details</label>
          <JSONInput
            id="product-line-details"
            placeholder={sampleProductDetails}
            locale={locale}
            height="250px"
            value={productLine.details}
            onChange={(e) =>
              onChange({ ...productLine, details: e.target.value })
            }
          />
        </li>
        <li className="category-section">
          <div className="category-heading">
            <h6 className="category-name">Products</h6>
            <span className="add-product" onClick={addProduct}>
              <i className="fas fa-plus" />
              <span>Add Product</span>
            </span>
          </div>
          <div className="product-list">
            {products.map((product, idx) => (
              <CreateProduct
                key={idx}
                onRemove={removeProduct}
                onChange={changeProduct}
                product={product}
              />
            ))}
          </div>
        </li>
        <li className="category-section">
          <div className="category-header">
            <h6 className="category-name">Taggings</h6>
            <span className="add-tagging" onClick={addTagging}>
              <i className="fas fa-plus" />
              <span>Add Tagging</span>
            </span>
          </div>
          <TagContext.Consumer>
            {({ existingTags, newTags }) =>
              taggings.map((tagging, idx) => (
                <CreateTagging
                  referenceTags={[...existingTags, ...newTags].filter(
                    ({ category = "" }) => !!~category.indexOf("PRODUCT__")
                  )}
                  key={idx}
                  onChange={changeTagging}
                  onRemove={removeTagging}
                  tagging={tagging}
                />
              ))
            }
          </TagContext.Consumer>
        </li>
      </ul>
    </div>
  );
};

export default CreateProductLine;

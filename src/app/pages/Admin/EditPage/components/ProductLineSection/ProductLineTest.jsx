import _ from "lodash";
import React, { useState } from "react";
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection";
import CreateTagging from "../BrandSection/Tagging";
import { DefaultEditor } from "react-simple-wysiwyg";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import ProductSection from "../ProductSection";
import RemoveButton from "../RemoveButton";
import TagContext from "../../../../../contexts/tag-context";
import "./_product-line.scss";

const sampleProductDetails = [
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
];

const ProductLine = ({ onRemove, onChange, productLine = {} }) => {
  const [products, setProducts] = useState(productLine.products || []);
  const [taggings, setTaggings] = useState(productLine.taggings || []);

  const addProduct = () => {
    setProducts(products.concat({ id: `tmp-${Date.now()}` }));
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
          className="product-line-name"
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
        <RemoveButton onRemove={() => onRemove(productLine)}>
          <span>
            <h5>
              Are you sure you want to remove this product line and all its
              children?
            </h5>
            <p>ID: {productLine.id}</p>
            <p>Name: {productLine.name}</p>
          </span>
        </RemoveButton>
      </div>
      <ul className="collapse" id={`collapse-product-line-${productLine.id}`}>
        <li>
          <CollapsibleSection
            id={`collapse-product-line-${productLine.id}-sizing`}
            label={<label>Sizing</label>}
          >
            <JSONInput
              height="500px"
              id="product-line-details"
              locale={locale}
              onChange={(e) =>
                onChange({
                  ...productLine,
                  details: {
                    ...productLine.details,
                    sizing: JSON.parse(e.json),
                  },
                })
              }
              placeholder={
                (productLine.details || {}).sizing || sampleProductDetails
              }
              width="1000px"
            />
          </CollapsibleSection>
        </li>
        <li>
          <CollapsibleSection
            id={`collapse-product-line-${productLine.id}-materials`}
            label={<label>Materials</label>}
          >
            <DefaultEditor
              value={(productLine.details || {}).materials || ""}
              onChange={(e) =>
                onChange({
                  ...productLine,
                  details: {
                    ...productLine.details,
                    materials: e.target.value,
                  },
                })
              }
            />
          </CollapsibleSection>
        </li>
        {/* <li className="category-section">
          <ProductSection
            onAdd={addProduct}
            onChange={changeProduct}
            onRemove={removeProduct}
            products={products}
          />
        </li> */}
      </ul>
    </div>
  );
};

export default ProductLine;

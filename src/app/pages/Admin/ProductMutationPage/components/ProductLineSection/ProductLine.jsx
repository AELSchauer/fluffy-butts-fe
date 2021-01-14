import _ from "lodash";
import React, { useState } from "react";
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection";
import CreateTagging from "../TaggingSection/Tagging";
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

  const removeProduct = (product) => {
    const idx = _.findIndex(products, { id: product.id });
    const newProducts = [...products.slice(0, idx), ...products.slice(idx + 1)];
    setProducts(newProducts);
    onChange({ ...productLine, products: newProducts });
  };

  const addTagging = () => {
    setTaggings(taggings.concat({ id: `tmp-${Date.now()}` }));
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
        <li className="category-section">
          <ProductSection
            onAdd={addProduct}
            onChange={changeProduct}
            onRemove={removeProduct}
            products={products}
          />
        </li>
        <li className="category-section">
          <div className="category-header">
            <h6 className="category-name">Taggings</h6>
            <span
              className="add-tagging"
              onClick={addTagging}
              onKeyPress={(e) => {
                e.key === "Enter" && addTagging();
              }}
              tabIndex="0"
            >
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

export default ProductLine;

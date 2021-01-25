import _ from "lodash";
import React, { useContext, useState } from "react";
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { DefaultEditor } from "react-simple-wysiwyg";
import Input from "../FormElements/Input";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import ProductSection from "../ProductSection/ProductSection";
import RemoveButton from "../RemoveButton/RemoveButton";
import TaggingSection from "../TaggingSection";
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

const ProductLine = ({ onRemove, path }) => {
  const { state, onChange, dispatch } = useContext(DiaperMutationContext);
  const [productLine, setProductLine] = useState(_.get(state, path));

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
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setProductLine} />
        <Input fieldName="displayOrder" path={path} onChange={setProductLine} />
        <RemoveButton onRemove={onRemove}>
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
              onChange={(e) => {
                dispatch({
                  type: "UPDATE",
                  fieldName: ["details", "sizing"],
                  path,
                  value: e.jsObject,
                });
                setProductLine({
                  ..._.set(productLine, ["details", "sizing"], e.jsObject),
                  mutation: true,
                });
              }}
              placeholder={_.get(
                productLine,
                ["details", "sizing"],
                sampleProductDetails
              )}
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
              value={_.get(productLine, ["details", "materials"], "")}
              onChange={(e) => {
                dispatch({
                  type: "UPDATE",
                  fieldName: ["details", "materials"],
                  path,
                  value: e.target.value,
                });
                setProductLine({
                  ..._.set(
                    productLine,
                    ["details", "materials"],
                    e.target.value
                  ),
                  mutation: true,
                });
              }}
            />
          </CollapsibleSection>
        </li>
        <li>
          <ProductSection path={[...path, "products"]} />
        </li>
        <li>
          <TaggingSection
            parentClassName="productLine"
            path={[...path, "taggings"]}
            taggableId={productLine.id}
          />
        </li>
      </ul>
    </div>
  );
};

export default ProductLine;

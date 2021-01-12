import _ from "lodash";
import React, { useContext } from "react";
import CollapsibleSection from "../CollapsibleSection/CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import { DefaultEditor } from "react-simple-wysiwyg";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import Input from "../Input";
import RemoveButton from "../RemoveButton/RemoveButton";
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

const ProductLine = ({ path, onRemove }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  return (
    <div className="product-line">
      <div className="col-12 info-display">
        <span
          className="info-toggle"
          data-toggle="collapse"
          data-target={`#collapse-product-line-${_.get(rootData, [
            ...path,
            "id",
          ])}`}
          aria-expanded="false"
          aria-controls={`collapse-product-line-${_.get(rootData, [
            ...path,
            "id",
          ])}`}
        >
          <i className="fas fa-caret-right" />
        </span>
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" required path={path} />
        <Input fieldName="displayOrder" path={path} />
        <RemoveButton onRemove={onRemove}>
          <span>
            <h5>
              Are you sure you want to remove this product line and all its
              children?
            </h5>
            <p>ID: {_.get(rootData, [...path, "id"])}</p>
          </span>
        </RemoveButton>
      </div>
      <ul
        className="collapse"
        id={`collapse-product-line-${_.get(rootData, [...path, "id"])}`}
      >
        <li>
          <CollapsibleSection
            id={`collapse-product-line-${_.get(rootData, [
              ...path,
              "id",
            ])}-sizing`}
            label={<label>Sizing</label>}
          >
            <JSONInput
              height="500px"
              id="product-line-details"
              locale={locale}
              onChange={(e) => {

              }}
              placeholder={
                _.get(rootData, [...path, "details", "sizing"]) ||
                sampleProductDetails
              }
              width="1000px"
            />
          </CollapsibleSection>
        </li>
        <li>
          <CollapsibleSection
            id={`collapse-product-line-${_.get(rootData, [
              ...path,
              "id",
            ])}-materials`}
            label={<label>Materials</label>}
          >
            <DefaultEditor
              value={_.get(rootData, [...path, "details", "materials"]) || ""}
              onChange={(e) => {
                const productLine = _.get(rootData, path);
                onChange(
                  Object.assign(_.get(rootData, path), {
                    ...productLine,
                    details: {
                      ...productLine.details,
                      materials: e.target.value,
                    },
                    mutation: true,
                  })
                );
              }}
            />
          </CollapsibleSection>
        </li>
      </ul>
    </div>
  );
};

export default ProductLine;

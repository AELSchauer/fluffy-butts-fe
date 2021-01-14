import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import ProductLine from "./ProductLineTest";
import "./_product-line.scss";

const ProductLineSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const productLines = _.get(rootData, path) || [];

  const onRemove = ({ id }, idx) => {
    (id.indexOf("tmp-") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeleteProductLine(id: "${id}") {
                  id
                }
              }
            `,
          },
        })
    ).then(() => {
      onChange(path, [
        ...productLines.slice(0, idx),
        ...productLines.slice(idx + 1),
      ]);
    });
  };

  return (
    <div className="category-section">
      <CollapsibleSection
        id={"product-line-section"}
        label={<h5 className="category-name">Product Lines</h5>}
      >
        <div className="product-line-list">
          {!!productLines
            ? productLines.map((productLine, idx) => (
                <ProductLine
                  key={idx}
                  path={[...path, `${idx}`]}
                  onRemove={() => onRemove(productLine, idx)}
                />
              ))
            : ""}
        </div>
        <AddButton className="product-line" path={path} />
      </CollapsibleSection>
    </div>
  );
};

export default ProductLineSection;

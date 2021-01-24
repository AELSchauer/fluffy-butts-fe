import _ from "lodash";
import React, { useContext } from "react";
import AddButton from "../AddButton";
import axios from "../../../../../utils/axios";
import CollapsibleSection from "../CollapsibleSection";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Product from "./Product";

const ProductSection = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);
  const products = _.get(rootData, path) || [];
  const sectionIndex = _.nth(path, -2);

  const onRemove = ({ id }, idx) => {
    (id.indexOf("tmp") > -1
      ? Promise.resolve()
      : axios({
          method: "POST",
          url: "/",
          data: {
            query: `
              mutation {
                DeleteProduct(id: "${id}") {
                  id
                }
              }
            `,
          },
        })
    ).then(() => {
      onChange(path, [...products.slice(0, idx), ...products.slice(idx + 1)]);
    });
  };

  return (
    <div className="category-section">
      <CollapsibleSection
        id={`collapse-products-${sectionIndex}-section`}
        label={<h6 className="category-name">Products</h6>}
      >
        <div className="product-list">
          {!!products
            ? products.map((product, idx) => (
                <Product
                  key={idx}
                  path={[...path, `${idx}`]}
                  onRemove={() => onRemove(product, idx)}
                />
              ))
            : ""}
        </div>
        <AddButton className="product" path={path} />
      </CollapsibleSection>
    </div>
  );
};

export default ProductSection;

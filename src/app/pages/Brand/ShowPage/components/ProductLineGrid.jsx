import React from "react";
import _ from "lodash";
import "../_brand-show-page.scss";

const ProductLinesGrid = ({ brand: { productLines = [], ...brand } }) => {
  const displayGroups = _.chain(productLines)
    .sortBy("displayOrder")
    .groupBy(
      ({ displayOrder = "" }) =>
        (displayOrder.match(/([\d\.]+)\.\d/) || [])[1] || ""
    )
    .value();
  const displayKeys = _.chain(displayGroups).keys().sort().value();

  return (
    <div className="product-line-grid">
      <h3 className="product-line-grid-heading">{brand.name} Product Lines</h3>
      <ul className="products-list">
        {displayKeys.map((displayKey) => (
          <div className="product-row" key={displayKey}>
            {displayGroups[displayKey].map(
              ({ id, name, images: [logo = {}] = [], tags = [] }) => {
                const heading = name.replace(/-- .*/g, "");
                const subHeading = name.replace(/.* -- /g, "");
                const href = `/brands/${brand.name}/products/${name
                  .replace(/ /g, "-")
                  .replace("™", "")}-${id}`;
                return (
                  <li key={id} className="product-container">
                    <a className="product" href={href}>
                      <img
                        className="product-image"
                        alt={logo.name}
                        src={logo.url}
                      />
                      <p className="product-heading product-line">{heading}</p>
                      {subHeading !== heading ? (
                        <p className="product-attribute product-line-style">
                          Style: {subHeading}
                        </p>
                      ) : undefined}
                      <div className="product-tags">
                        {tags.map((tag) => (
                          <span key={tag.id} className="product-tag">
                            <a
                              className="product-tag-link"
                              href={`browse?tags=${encodeURIComponent(
                                tag.name
                              )}&page=1`}
                            >
                              {tag.name
                                .replace(/ /g, "\u00a0")
                                .replace(/-/g, "\u2011")}
                            </a>
                          </span>
                        ))}
                      </div>
                    </a>
                  </li>
                );
              }
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default ProductLinesGrid;

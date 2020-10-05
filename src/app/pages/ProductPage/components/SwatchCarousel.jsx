import React, { useState } from "react";
import dynamicClassNames from "classnames";
import Tooltip from "../../../components/Tooltip";
import _ from "lodash";
import "../_product-page.scss";

const SwatchCarousel = ({
  clickSwatch,
  country,
  pageSize = 24,
  pageProductId,
  products = [],
}) => {
  const productIndex = products.findIndex(({ id }) => id === pageProductId);
  const [displayPage, setDisplayPage] = useState(
    Math.ceil((productIndex >= 0 ? productIndex + 1 : 1) / pageSize)
  );
  const maxDisplayPage = Math.ceil(products.length / pageSize);
  const start = (displayPage - 1) * pageSize;
  const end = start + pageSize;
  const displayProductIds = (maxDisplayPage > 1
    ? products.slice(start, end)
    : products
  ).map(({ id }) => id);
  const swatchesClassNames = {
    swatches: true,
    center: products.length < 8,
  };

  return (
    <div className="swatch-carousel">
      {maxDisplayPage > 1 ? (
        <div
          role="button"
          className="swatch-carousel-button"
          onClick={() =>
            setDisplayPage(displayPage === 1 ? maxDisplayPage : displayPage - 1)
          }
        >
          <i className="fas fa-angle-left" />
          <span className="sr-only">Previous</span>
        </div>
      ) : (
        ""
      )}
      <ul className={dynamicClassNames(swatchesClassNames)}>
        {_.sortBy(products, "name").map((relProduct) => {
          const { id, images: [image = {}] = [] } = relProduct;
          const swatchClassNames = {
            swatch: true,
            selected: pageProductId === id,
            hide: !~displayProductIds.indexOf(id),
          };
          const swatchImageClassNames = {
            "swatch-image": true,
            unavailable:
              country.name === "World"
                ? false
                : !relProduct.listings.filter(
                    ({
                      countries = [],
                      retailer: { shipping: { shipsTo = [] } = {} } = {},
                    }) =>
                      countries
                        .concat(shipsTo.map(({ country }) => country))
                        .includes(country.name)
                  ).length,
          };
          return (
            <Tooltip placement="top" content={relProduct.name} key={id}>
              <li
                className={dynamicClassNames(swatchClassNames)}
                onClick={() => clickSwatch(relProduct)}
              >
                <div
                  className={dynamicClassNames(swatchImageClassNames)}
                  style={{
                    backgroundImage: `url(${image.url})`,
                  }}
                />
              </li>
            </Tooltip>
          );
        })}
      </ul>
      {maxDisplayPage > 1 ? (
        <div
          className="swatch-carousel-button"
          role="button"
          onClick={() =>
            setDisplayPage(displayPage === maxDisplayPage ? 1 : displayPage + 1)
          }
        >
          <i className="fas fa-angle-right" />
          <span className="sr-only">Next</span>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SwatchCarousel;

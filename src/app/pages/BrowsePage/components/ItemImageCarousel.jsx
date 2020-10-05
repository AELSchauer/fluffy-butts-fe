import React, { useState } from "react";
import dynamicClassNames from "classnames";
import "../_browse-page.scss";

const ItemImageCarousel = ({ items = [] }) => {
  const [displayPage, setDisplayPage] = useState(0);
  const maxDisplayPage = items.length - 1;

  return (
    <div className="item-image-carousel">
      <div
        role="button"
        className="image-carousel-button"
        onClick={() =>
          setDisplayPage(displayPage === 1 ? maxDisplayPage : displayPage - 1)
        }
      >
        <i className="fas fa-angle-left" />
        <span className="sr-only">Previous</span>
      </div>
      <div className="item-images-wrapper">
        {items.map(({ href, images: [{ url } = {}] = [] } = {}, idx) => {
          const imageClassNames = {
            "item-image-wrapper": true,
            selected: idx === displayPage,
            hide: idx !== displayPage,
          };
          return (
            <a
              className={dynamicClassNames(imageClassNames)}
              href={href}
            >
              <img className="product-image" src={url} />
            </a>
          );
        })}
      </div>
      <div
        className="image-carousel-button"
        role="button"
        onClick={() =>
          setDisplayPage(displayPage === maxDisplayPage ? 0 : displayPage + 1)
        }
      >
        <i className="fas fa-angle-right" />
        <span className="sr-only">Next</span>
      </div>
    </div>
  );
};

export default ItemImageCarousel;

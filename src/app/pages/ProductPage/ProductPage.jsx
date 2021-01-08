import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import axios from "../../utils/axios";
import CountryContext from "../../contexts/country-context";
import Listings from "./components/Listings";
import SizingTable from "./components/SizingTable/SizingTable";
import SwatchCarousel from "./components/SwatchCarousel";
import Tooltip from "../../components/Tooltip";
import { useQuery } from "../../utils/query-params";
import "./_product-page.scss";

const ProductPage = (props) => {
  const siblingPageSize = 24;
  const query = useQuery();
  const { country } = useContext(CountryContext);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [productLine, setProductLine] = useState({});
  const [product, setProduct] = useState({});
  const [cousinProducts, setCousinProducts] = useState([]);
  const [familyProducts, setFamilyProducts] = useState([]);

  const setActiveProduct = (productId, productLine) => {
    const { products = [] } = productLine;
    const product = products.find(({ id }) => id === productId) || 0;
    const { pattern: { products: cousins = [] } = {} } = product;
    setProduct(product);
    setCousinProducts(cousins.filter(({ id }) => product.id !== id));
    setFamilyProducts(products);
  };

  const getProduct = () => {
    const productLineId = props.match.params.productLineSlug.match(/\d+$/)[0];
    return axios({
      method: "get",
      url: `/graphql`,
      data: {
        query: `
          {
            product_lines (filter__id: "${productLineId}") {
              id
              name
              details
              brand {
                id
                name
              }
              images {
                url
              }
              products (filter__available: true) {
                id
                name
                images {
                  url
                }
                listings {
                  id
                  countries
                  currency
                  url
                  price
                  sizes
                  retailer {
                    id
                    name
                    url
                    shipping
                  }
                }
                pattern {
                  id
                  name
                  products (filter__available: true) {
                    id
                    name
                    images {
                      url
                    }
                    product_line {
                      id
                      name
                      display_order
                    }
                  }
                }
              }
            }
          }
        `,
      },
    })
      .then(
        ({
          data: { data: { productLines: [productLine = {}] = [] } = {} } = {},
        }) => {
          setProductLine(productLine);
          if (/\d+$/.test(query.get("variant"))) {
            setActiveProduct(
              query.get("variant").match(/\d+$/)[0],
              productLine
            );
          } else {
            setFamilyProducts(productLine.products);
          }
          setIsLoading(false);
        }
      )
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  const updateWindowQuery = ({ id, name }) => {
    var newurl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      new URLSearchParams(`variant=${name.toLowerCase()}--${id}`).toString();
    window.history.replaceState({}, document.title, newurl);
  };

  const clickSwatch = (swatchProduct) => {
    if (swatchProduct.id !== product.id) {
      setActiveProduct(swatchProduct.id, productLine);
      updateWindowQuery(swatchProduct);
    }
  };

  const renderFamilyProductsList = () => {
    return (
      <SwatchCarousel
        country={country}
        clickSwatch={clickSwatch}
        pageProductId={product.id}
        pageSize={siblingPageSize}
        products={familyProducts}
      />
    );
  };

  const conversion = {
    kg: {
      lb: 2.20462,
    },
    lb: {
      kb: 0.45359,
    },
  };

  const renderContent = () => {
    const {
      name: productLineName,
      details: { materials = "", sizing = [] } = {},
      brand = {},
      images: [defaultImage = {}] = [],
    } = productLine;
    const { name, images: [image = {}] = [] } = product;

    return (
      <div className="product-page-content">
        <div className="product-info">
          <div className="image-section">
            <img
              className="product-image"
              alt={image.name || productLineName}
              src={image.url || defaultImage.url}
            />
          </div>
          <div className="info-section">
            <div className="product-attributes">
              <a
                className="product-attribute product-brand"
                href={`/brands/${brand.name}-${brand.id}`}
              >
                {brand.name}
              </a>
              <p className="product-attribute product-name">
                {productLine.name}
              </p>
            </div>
            <hr />
            <div className="related-products-section">
              {Object.keys(product).length ? (
                <p className="product-pattern">
                  Pattern: <span className="bold">{name}</span>
                </p>
              ) : (
                ""
              )}
              {renderFamilyProductsList(familyProducts, "name")}
            </div>
            {sizing.length || materials ? (
              <div className="product-details">
                <div className="accordion" id="product-details-accordion">
                  {sizing ? (
                    <div
                      data-toggle="collapse"
                      data-target={`#collapse-sizing`}
                      aria-expanded="true"
                      aria-controls={`collapse-sizing`}
                    >
                      <div
                        className="product-details-header"
                        id={`heading-sizing`}
                      >
                        <p className="product-details-title">Sizing</p>
                      </div>
                      <div
                        id={`collapse-sizing`}
                        className="collapse"
                        aria-labelledby={`heading-sizing`}
                        data-parent="#product-details-accordion"
                      >
                        <div className="product-details-body sizing-body">
                          <SizingTable sizing={sizing} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  {materials ? (
                    <div
                      data-toggle="collapse"
                      data-target={`#collapse-materials`}
                      aria-expanded="true"
                      aria-controls={`collapse-materials`}
                    >
                      <div
                        className="product-details-header"
                        id={`heading-materials`}
                      >
                        <p className="product-details-title">Materials</p>
                      </div>
                      <div
                        id={`collapse-materials`}
                        className="collapse"
                        aria-labelledby={`heading-materials`}
                        data-parent="#product-details-accordion"
                      >
                        <div
                          className="product-details-body materials-body"
                          dangerouslySetInnerHTML={{
                            __html: materials,
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <Listings
          country={country}
          productLine={productLine}
          product={product}
        />
        {cousinProducts.length ? (
          <React.Fragment>
            <hr />
            <div className="cousin-products-section">
              <h3>Other Products in this Pattern</h3>
              <ul className="cousin-products">
                {_.sortBy(cousinProducts, "displayOrder").map((relProduct) => {
                  const {
                    id,
                    name,
                    productLine,
                    images: [image = {}] = [],
                  } = relProduct;
                  return (
                    <Tooltip
                      placement="top"
                      content={productLine.name.replace(/-/g, "\u2011")}
                      key={id}
                    >
                      <li className="cousin-product">
                        <a
                          href={`${productLine.name.replace(/ /g, "+")}--${
                            productLine.id
                          }?variant=${name
                            .toLowerCase()
                            .replace(/ /g, "+")}--${id}`}
                        >
                          <img
                            className="cousin-product-image"
                            src={image.url}
                            alt={image.name}
                          />
                        </a>
                      </li>
                    </Tooltip>
                  );
                })}
              </ul>
            </div>
          </React.Fragment>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <section className="product-page page">
      {isLoading ? "..." : renderContent()}
    </section>
  );
};

export default ProductPage;

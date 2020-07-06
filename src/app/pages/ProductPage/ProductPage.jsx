import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import _ from "lodash";
import Tooltip from "../../components/Tooltip";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import { useQuery } from "../../utils/query-params";
import Listings from "./components/Listings";
import SwatchCarousel from "./components/SwatchCarousel";
import "./_product-page.scss";

const ProductPage = (props) => {
  const siblingPageSize = 24;
  const query = useQuery();
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
    return Promise.all([
      axios({
        method: "get",
        url: `/product-lines/${productLineId}`,
        params: {
          include: ["brand", "images"],
        },
      }),
      axios({
        method: "get",
        url: `/products`,
        params: {
          "filter[product-line]": productLineId,
          "filter[available]": true,
          include: [
            "images",
            "listings",
            "listings.retailer",
            "pattern",
            "pattern.products",
            "pattern.products.images",
          ],
        },
      }),
    ])
      .then(
        ([
          { data: { data = {} } = {} } = {},
          { data: { data: productsData = {} } = {} } = {},
        ] = []) => {
          data.products = productsData;
          console.log(data);
          setProductLine(data);
          if (/\d+$/.test(query.get("variant"))) {
            setActiveProduct(query.get("variant").match(/\d+$/)[0], data);
          } else {
            setFamilyProducts(data.products);
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
        clickSwatch={clickSwatch}
        pageProductId={product.id}
        pageSize={siblingPageSize}
        products={familyProducts}
      />
    );
  };

  const renderContent = () => {
    const {
      name: productLineName,
      brand = {},
      images: [defaultImage = {}] = [],
    } = productLine;
    const { name, images: [image = {}] = [], listings, tags = [] } = product;

    return (
      <div className="product-page-content">
        <div className="product-info">
          <img
            className="product-image"
            alt={image.name || productLineName}
            src={image.url || defaultImage.url}
          />
          <div className="info-section">
            <a
              className="product-attribute product-brand"
              href={`/brands/${brand.name}-${brand.id}`}
            >
              {brand.name}
            </a>
            <p className="product-attribute product-name">{productLine.name}</p>
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
          </div>
        </div>
        <Listings productLine={productLine} product={product} />
        <hr />
        {cousinProducts.length ? (
          <div className="cousin-products-section">
            <h3>Other Products in this Pattern</h3>
            <ul className="cousin-products">
              {_.sortBy(cousinProducts, "displayOrder").map((relProduct) => {
                const {
                  id,
                  name,
                  productLineData,
                  images: [image = {}] = [],
                } = relProduct;
                return (
                  <Tooltip
                    placement="top"
                    content={productLineData.name.replace(/-/g, "\u2011")}
                    key={id}
                  >
                    <li className="cousin-product">
                      <a
                        href={`${productLineData.name.replace(/ /g, "+")}--${
                          productLineData.id
                        }?variant=${name
                          .toLowerCase()
                          .replace(/ /g, "+")}--${id}`}
                      >
                        <img
                          className="cousin-product-image"
                          src={image.link}
                          alt={image.name}
                        />
                      </a>
                    </li>
                  </Tooltip>
                );
              })}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <section className="product-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        renderContent()
      )}
    </section>
  );
};

export default ProductPage;

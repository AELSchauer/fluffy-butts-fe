import React, { useState, useEffect } from "react";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import axios from "../../utils/axios";
import { findOne } from "../../utils/json-api";
import { useQuery } from "../../utils/query-params";
import Pagination from "../../components/Pagination";
import SearchFilter from "./SearchFilter";
import "./_search-page.scss";

const SearchPage = (props) => {
  const query = useQuery();
  const [currentPage] = useState(parseInt(query.get("page") || 1));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(1);
  const [products, setProducts] = useState([]);

  const convertPageQueryToJsonApiQuery = () => {
    return Object.assign(
      !!query.get("tags") && {
        "filter[tags.name]": query.get("tags"),
      },
      !!query.get("brands") && {
        "filter[brand.name]": query.get("brands"),
      },
      !!query.get("product-lines") && {
        "filter[product-line]": query.get("product-lines"),
      },
      !!query.get("page") && { "page[number]": query.get("page") },
      !!query.get("size") && { "page[size]": query.get("size") }
    );
  };

  const getProducts = async () =>
    axios({
      method: "get",
      url: "/products",
      params: {
        include: [
          "brand",
          "images",
          "pattern.tags",
          "product-line",
          "product-line.tags",
        ],
        // sort: ["brand.name", "product-line.name", "name"],
        ...convertPageQueryToJsonApiQuery(),
      },
    })
      .then(
        ({
          data: {
            data = [],
            included = [],
            links: { last: lastPageLink } = {},
          },
        }) => ({
          maxPages: parseInt(lastPageLink.match(/&page%5Bnumber%5D=(\d+)/)[1]),
          products: data.map(
            ({
              id,
              type,
              attributes,
              relationships: {
                brand: { data: brandRel = {} } = {},
                images: { data: [imageRel = {}] = [] } = {},
                pattern: { data: patternRel = {} } = {},
                "product-line": { data: productLineRel = {} } = {},
              },
            }) => {
              const brand = findOne(included, brandRel);
              const logo = findOne(included, imageRel) || {
                attributes: { link: "", name: "" },
              };
              const pattern = findOne(included, patternRel);
              const productLine = findOne(included, productLineRel);
              const tags = [pattern, productLine]
                .reduce(
                  (
                    tags,
                    { relationships: { tags: { data = [] } = {} } = {} } = {}
                  ) => tags.concat(data),
                  []
                )
                .map((tag) => findOne(included, tag))
                .sort((a, b) =>
                  a.attributes.name > b.attributes.name ? 1 : -1
                );

                console.log(productLine, included[included.length - 1])
              return {
                id,
                type,
                attributes,
                brand,
                logo,
                pattern,
                productLine,
                tags,
              };
            }
          ),
        })
      )
      .then((result) => {
        result.maxPages && setMaxPages(result.maxPages);
        result.products && setProducts(result.products);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        return {};
      });

  useEffect(() => {
    getProducts();
  }, []);

  const getPagination = () => {
    return products.length ? (
      <Pagination
        currentPage={currentPage}
        description="Search page pagination"
        maxPages={maxPages}
        query={query}
        url="/search"
      />
    ) : (
      ""
    );
  };

  const getProductsGrid = () => {
    return (
      <div className="products-grid">
        {getPagination()}
        <ul className="products-list">
          {products.length ? (
            products.map((product) => (
              <li key={product.id} className="product-container">
                <a className="product" href={`products/${product.id}`}>
                  <img
                    className="product-image"
                    alt={product.logo.attributes.name}
                    src={product.logo.attributes.link}
                  />
                  <p className="product-attribute product-brand">
                    {product.brand.attributes.name}
                  </p>
                  <p className="product-attribute product-line">
                    {product.productLine.attributes.name}
                  </p>
                  <p className="product-attribute product-name">
                    {product.attributes.name}
                  </p>
                  <div className="product-tags">
                    {product.tags.map((tag) => (
                      <span key={tag.id} className="product-tag">
                        <a
                          className="product-tag-link"
                          href={`search?tags=${encodeURIComponent(tag.attributes.name)}&page=1`}
                        >
                          {tag.attributes.name
                            .replace(/ /g, "\u00a0")
                            .replace(/-/g, "\u2011")}
                        </a>
                      </span>
                    ))}
                  </div>
                </a>
              </li>
            ))
          ) : (
            <div className="no-results">Sorry, no results were found!</div>
          )}
        </ul>
        {getPagination()}
      </div>
    );
  };

  return (
    <section className="search-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        <React.Fragment>
          <SearchFilter query={query} />
          {getProductsGrid()}
        </React.Fragment>
      )}
    </section>
  );
};

export default SearchPage;

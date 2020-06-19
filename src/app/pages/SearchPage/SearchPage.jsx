import React, { useState, useEffect } from "react";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import axios from "../../utils/axios";
import { findOne } from "../../utils/json-api";
import { useQuery } from "../../utils/query-params";
import Pagination from "../../components/Pagination";
import SearchFilter from "./SearchFilter";
import "./_search-page.scss";

const SearchPage = (props) => {
  const params = new URLSearchParams(props.location.search);
  const [currentPage] = useState(parseInt(params.get("page") || 1));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(1);
  const [products, setProducts] = useState([]);
  const query = useQuery();

  const convertPageQueryToJsonApiQuery = () => {
    console.log(query.get("page"));
    return Object.assign(
      !!query.get("tags") && {
        "filter[tags.name]": query.get("tags"),
      },
      !!query.get("brand") && {
        "filter[brand.name]": query.get("brand"),
      },
      !!query.get("page") && { "page[number]": query.get("page") }
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
        sort: ["brand.name", "product-line.name", "name"],
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

              const {
                relationships: { tags: { data: patternTags = [] } = {} } = {},
              } = pattern;
              const {
                relationships: {
                  tags: { data: productLineTags = [] } = {},
                } = {},
              } = productLine;

              const tags = [...patternTags, ...productLineTags]
                .map((tag) => findOne(included, tag))
                .sort((a, b) =>
                  a.attributes.name > b.attributes.name ? 1 : -1
                );

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
      .catch((error) => setHasError(true) && setIsLoading(false));

  useEffect(() => {
    async function fetchData() {
      const result = await getProducts();
      setProducts(result.products);
      setMaxPages(result.maxPages);
      setIsLoading(false);
    }
    fetchData();
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
                          href={`search?tags=${tag.attributes.name}&page=1`}
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
            <div class="no-results">Sorry, no results were found!</div>
          )}
        </ul>
        {getPagination()}
      </div>
    );
  };

  return (
    <div className="search-page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        <React.Fragment>
          {getProductsGrid()}
          <SearchFilter query={query} />
        </React.Fragment>
      )}
    </div>
  );
};

export default SearchPage;

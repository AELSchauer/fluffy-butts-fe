import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import Ellipsis from "@bit/joshk.react-spinners-css.ellipsis";
import _ from "lodash";
import Pagination from "../../components/Pagination";
import ProductGrid from "./components/ProductGrid";
import SearchFilter from "./components/SearchFilter";
import { useQuery } from "../../utils/query-params";
import "./_search-page.scss";

const SearchPage = () => {
  const query = useQuery();
  const [currentPage] = useState(parseInt(query.get("page") || 1));
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [maxPages, setMaxPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const convertPageQueryToJsonApiQuery = () => {
    return Object.assign(
      !!query.get("tags") && {
        "filter[tags.name]": query.get("tags"),
      },
      !!query.get("brands") && {
        "filter[brand.name]": query.get("brands"),
      },
      !!query.get("product-lines") && {
        "filter[product-line.name]": query.get("product-lines"),
      },
      !!query.get("page") && { "page[number]": query.get("page") },
      !!query.get("size") && { "page[size]": query.get("size") }
    );
  };

  const getBrands = () => {
    return axios({
      method: "get",
      url: "/brands",
      params: {
        sort: ["name_insensitive"],
      },
    }).then(({ data: { data = [] } }) => setBrands(data));
  };

  const getTags = () => {
    return axios({
      method: "get",
      url: "/tags",
      params: {
        sort: ["category", "name"],
      },
    }).then(({ data: { data = [] } }) =>
      setCategories(_.groupBy(data, "category"))
    );
  };

  const getDefaultProducts = () => {
    const queryKeys = [];
    query.forEach((value, key) => {
      if (key !== "page" && key !== "size") {
        queryKeys.push(key);
      }
    });
    return queryKeys.length === 1 && queryKeys[0] === "brands"
      ? axios({
          method: "get",
          url: "/product-lines-display",
          params: {
            ...convertPageQueryToJsonApiQuery(),
          },
        }).then(({ data: { data } = {} }) => setDefaultProducts(data))
      : Promise.resolve({});
  };

  const getProducts = () => {
    return axios({
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
    }).then(({ data: { data = [], links: { last: lastPageLink } = {} } }) => {
      setMaxPages(parseInt(lastPageLink.match(/&page%5Bnumber%5D=(\d+)/)[1]));
      setProducts(data);
    });
  };

  useEffect(() => {
    Promise.all([getBrands(), getTags(), getDefaultProducts(), getProducts()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error)
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, []);

  const renderPagination = () => {
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

  const getUpdatedHref = (categoryName, itemName) => {
    const tempQuery = new URLSearchParams(query.toString());
    const newSet = tempQuery
      .get(categoryName)
      .split(",")
      .filter((i) => i !== itemName);

    if (newSet.length) {
      tempQuery.set(categoryName, newSet);
    } else {
      tempQuery.delete(categoryName);
      categoryName === "brands" && tempQuery.delete("product-lines");
    }
    tempQuery.set("page", 1);
    return tempQuery.toString();
  };

  const renderActiveTags = () => {
    query.sort();
    const activeTags = [];
    let i = 0;
    for (var [categoryName, values] of query.entries()) {
      if (categoryName !== "page" && categoryName !== "size") {
        values
          .split(",")
          .sort()
          .forEach((tagName) => {
            activeTags.push(
              <div className="active-tag" key={i}>
                <span>{tagName}</span>
                <a
                  className="close-active-tag"
                  href={`/search?${getUpdatedHref(categoryName, tagName)}`}
                >
                  <i className="fas fa-times" />
                </a>
              </div>
            );
          });
        i++;
      }
    }
    return <div className="active-tags">{activeTags}</div>;
  };

  const renderFilterModal = () => {
    return (
      <div className="modal-toggle">
        <div
          className="bg-secondary modal-button text-body"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Filter
        </div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fas fa-times" />
                </button>
                <SearchFilter
                  brands={brands}
                  categories={categories}
                  query={query}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="search-page page">
      {isLoading ? (
        <Ellipsis className="loading" color="#42b983" />
      ) : (
        <React.Fragment>
          <div className="search-filter">
            <SearchFilter
              brands={brands}
              categories={categories}
              query={query}
            />
          </div>
          <div className="search-display">
            {renderFilterModal()}
            {renderPagination()}
            {renderActiveTags()}
            {products.length ? (
              <ProductGrid
                headingText={
                  defaultProducts.length &&
                  `Browse All ${products[0].brand.name} Products`
                }
                products={products}
              />
            ) : (
              <div className="no-results">Sorry, no results were found!</div>
            )}
            {renderPagination()}
          </div>
        </React.Fragment>
      )}
    </section>
  );
};

export default SearchPage;

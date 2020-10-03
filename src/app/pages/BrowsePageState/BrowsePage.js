import React, { useContext, useEffect, useState } from "react";
import _ from "lodash";
import axios from "../../utils/axios";
import BrowseFilter from "./components/BrowseFilter";
import CountryContext from "../../contexts/country-context";
import ProductGrid from "./components/ProductGrid";
import { useQuery } from "../../utils/query-params";
import "./_browse-page.scss";

const BrowsePage = () => {
  const [allProductLines, setAllProductLines] = useState([]);
  const [brands, setBrands] = useState([]);
  const { country } = useContext(CountryContext);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState(useQuery());
  const [tags, setTags] = useState([]);

  const updateQuery = (query) => {
    window.history.replaceState(
      {},
      document.title,
      window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        "?" +
        query.toString()
    );
    setQuery(query);
  };

  const getBrands = () => {
    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            brands (order_by: "name_insensitive:asc") {
              id
              name
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } }) => {
      setBrands(brands);
      return brands;
    });
  };

  const getTags = () => {
    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            tags (order_by: "category:asc,display_order:asc,name:asc") {
              name
              category
              display_order
            }
          }
        `,
      },
    }).then(({ data: { data: { tags = [] } = {} } }) => {
      setTags(tags);
      return tags;
    });
  };

  const getProductLines = () => {
    const filterAvailability =
      country.name !== "World"
        ? `, filter__availability: "${country.name}"`
        : "";

    return axios({
      method: "get",
      url: "/graphql",
      params: {
        query: `
          {
            brands (order_by: "name_insensitive:asc") {
              product_lines (order_by: "name_insensitive:asc") {
                brand {
                  id
                  name
                }
                images {
                  name
                  url
                }
                products (order_by: "name_insensitive:asc", filter__available: true${filterAvailability}) {
                  id
                  name
                  tags {
                    name
                    category
                  }
                }
                tags {
                  name
                  category
                }
              }
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } = {} }) => {
      const productLineArr = brands.reduce(
        (productLineArr, { productLines }) =>
          productLineArr.concat(productLines),
        []
      );
      setAllProductLines(productLineArr);
      return productLineArr;
    });
  };

  useEffect(() => {
    Promise.all([getTags(), getProductLines(), getBrands()])
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, []);

  return (
    <section className="browse-page page">
      {isLoading ? (
        "..."
      ) : (
        <React.Fragment>
          <div className="browse-filter">
            <BrowseFilter brands={brands} tags={tags} />
          </div>
          <div className="browse-display">
            <ProductGrid allProducts={allProductLines} />
          </div>
        </React.Fragment>
      )}
    </section>
  );
};

export default BrowsePage;

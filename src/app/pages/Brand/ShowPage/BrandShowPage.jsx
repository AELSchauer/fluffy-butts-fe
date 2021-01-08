import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import { useQuery } from "../../../utils/query-params";
import ProductLineGrid from "./components/ProductLineGrid";
import "./_brand-show-page.scss";

const BrandShowPage = (props) => {
  const query = useQuery();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [brand, setBrand] = useState([]);

  const getBrand = () => {
    const brandId = props.match.params.brandSlug.match(/\d+$/)[0];
    return axios({
      method: "POST",
      url: "/",
      data: {
        query: `
          {
            brands (filter__id: "${brandId}") {
              id
              name
              product_lines {
                id
                name
                display_order
                images {
                  id
                  url
                }
                tags {
                  name
                }
              }
            }
          }
        `,
      },
    }).then(({ data: { data: { brands: [brand] = [] } = {} } = {} }) =>
      setBrand(brand)
    );
  };

  useEffect(() => {
    getBrand()
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        return {};
      });
  }, []);

  return (
    <section className="brand-show-page page">
      <ProductLineGrid brand={brand} />
    </section>
  );
};

export default BrandShowPage;

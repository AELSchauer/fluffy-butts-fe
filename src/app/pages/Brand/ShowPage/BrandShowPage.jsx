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
    return axios({
      method: "get",
      url: `/brands/${props.match.params.brandSlug.match(/\d+$/)[0]}`,
      params: {
        include: [
          "product-lines",
          "product-lines.images",
          "product-lines.tags",
        ],
      },
    }).then(({ data: { data = {} } }) => setBrand(data));
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

import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import "./_brand-index-page.scss";

const BrandIndexPage = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    axios({
      method: "POST",
      url: "/",
      data: {
        query: `
          {
            brands (order_by: "name_insensitive:asc") {
              id
              name
              images {
                url
              }
            }
          }
        `,
      },
    }).then(({ data: { data: { brands = [] } = {} } = {} }) =>
      setBrands(brands)
    );
  }, []);

  return (
    <section className="brand-index-page page">
      {brands.map(({ id, name, images: [logo = {}] = [] }) => (
        <li className="brand col-3" key={id}>
          <a
            className="brand-link"
            href={`/brands/${name
              .toLowerCase()
              .replace(/ /g, "-")
              .replace("™", "")}-${id}`}
          >
            <img className="brand-logo" alt={logo.name} src={logo.url} />
          </a>
        </li>
      ))}
    </section>
  );
};

export default BrandIndexPage;

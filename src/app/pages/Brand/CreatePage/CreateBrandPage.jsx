import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
// import "./_brand-index-page.scss";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";

const BrandIndexPage = () => {
  const sampleProductLineDetails = {
    sizing: [
      {
        name: "one size",
        weight: {
          max: [
            { num: 15, unit: "kg" },
            { num: 33, unit: "lb" },
          ],
          min: [
            { num: 3, unit: "kg" },
            { num: 6.6, unit: "lb" },
          ],
        },
        dimensions: {
          width: [{ num: 13, unit: "in" }],
          length: [{ num: 15, unit: "in" }],
        },
      },
    ],
    materials:
      "<ul><li>Outer: polyester TPU</li><li>Inner: suede cloth (100% polyester)</li><li>Insert(s): 1 x 3-layer microfiber (80% polyester, 20% polyamide) insert</li></ul>",
  };
  // useEffect(() => {
  //   axios({
  //     method: "get",
  //     url: "/graphql",
  //     params: {
  //       query: `
  //         {
  //           brands (order_by: "name_insensitive:asc") {
  //             id
  //             name
  //             images {
  //               url
  //             }
  //           }
  //         }
  //       `,
  //     },
  //   }).then(({ data: { data: { brands = [] } = {} } = {} }) =>
  //     setBrands(brands)
  //   );
  // }, []);

  return (
    <section className="brand-create-page page">
      woot woot!
      <form>
        <div>
          <label>Brand Name</label>
          <input type="text" />
        </div>
        <div>
          <p>Product Lines</p>
          <div>
            <label>Name</label>
            <input type="text" />
            <i className="fas fa-plus" />
          </div>
          <div>
            <label>Display Order</label>
            <input type="text" />
          </div>
          <div>
            <label>Details</label>
            <JSONInput
              id="a_unique_id"
              placeholder={sampleProductLineDetails}
              locale={locale}
              height="550px"
            />
            ;
          </div>
        </div>
      </form>
    </section>
  );
};

export default BrandIndexPage;

import React, { useEffect, useState } from "react";
import DiaperMutationContext from "../../../contexts/diaper-mutation-context";
import axios from "../../../utils/axios";
import BrandSection from "./components/BrandSection/BrandTest";
import _ from "lodash";

const MutationPage = (props) => {
  const [rootData, setRootData] = useState({
    brand: {
      id: `tmp-${Date.now()}`,
      mutation: true,
    },
  });
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    props.match.params.brandName &&
      axios({
        method: "POST",
        url: "/",
        data: {
          query: `
            {
              brands (filter__name_insensitive: "${props.match.params.brandName}") {
                id
                name
                product_lines {
                  id
                  name
                  details
                  display_order
                  products (order_by: "name:asc")  {
                    id
                    name
                    pattern_id
                  }
                }
                patterns (order_by: "name:asc") {
                  id
                  name
                }
              }
            }
          `,
        },
      }).then(({ data: { data: { brands: [brand] = [] } = {} } = {} }) => {
        setRootData({ brand });
      });
  }, []);

  const onChange = (path, data) => {
    setRootData({
      brand: _.set(rootData, path, data).brand,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("WOOHOO!");
  };

  return (
    <DiaperMutationContext.Provider value={{ rootData, onChange }}>
      <section className="create-page page">
        {!isAuthorized ? <div>Not authorized. Please login again.</div> : null}
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Brand</h3>
            <BrandSection path={["brand"]} />
          </div>
          <button type="submit">Submit</button>
        </form>
        {JSON.stringify(rootData)}
      </section>
    </DiaperMutationContext.Provider>
  );
};

export default MutationPage;

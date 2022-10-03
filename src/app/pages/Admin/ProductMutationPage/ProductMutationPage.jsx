import _ from "lodash";
import React, { useEffect, useState } from "react";
import DiaperMutationContext from "../../../contexts/diaper-mutation-context";
import axios from "../../../utils/axios";
import BrandSection from "./components/BrandSection";
import TagSection from "./components/TagSection";
import submitForm from "./submit-form";

import { useReducer } from "react";
import reducer from "./reducer";

const MutationPage = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    brand: {
      id: `tmp${Date.now()}`,
      mutation: true,
    },
    tags: [],
  });
  const [dynamicState, setRootData] = useState({
    brand: {
      id: `tmp${Date.now()}`,
      mutation: true,
    },
    tags: [],
  });
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    props.match.params.brandId &&
      axios({
        method: "POST",
        url: "/",
        data: {
          query: `
            {
              brands(filter__id: "${props.match.params.brandId}") {
                id
                name
                product_lines {
                  id
                  name
                  details
                  display_order
                  products (order_by: "name:asc") {
                    id
                    name
                    pattern_id
                  }
                  taggings {
                    id
                    tag {
                      id
                      name
                    }
                  }
                }
                patterns(order_by: "name:asc") {
                  id
                  name
                  taggings {
                    id
                    tag {
                      id
                      name
                    }
                  }
                }
              }
              tags {
                id
                name
                category
                display_order
              }
            }
          `,
        },
      }).then(
        ({ data: { data: { brands: [brand] = [], tags = [] } = {} } = {} }) => {
          dispatch({ type: "INITIAL", data: { brand, tags } });
          setRootData({ brand, tags });
        }
      );
  }, []);

  const onChange = (path, data) => {
    setRootData({
      brand: _.set(dynamicState, path, data).brand,
      tags: _.set(dynamicState, path, data).tags,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("WOOHOO!", state);
    // submitForm(dynamicState, onChange);
  };

  return (
    <DiaperMutationContext.Provider
      value={{ dynamicState, onChange, state, dispatch }}
    >
      <section className="create-page page">
        {!isAuthorized ? <div>Not authorized. Please login again.</div> : null}
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Brand</h3>
            <BrandSection path={["brand"]} />
          </div>
          <div>
            <TagSection path={["tags"]} />
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
    </DiaperMutationContext.Provider>
  );
};

export default MutationPage;

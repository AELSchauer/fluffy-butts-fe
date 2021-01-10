import React, { useEffect, useState } from "react";
import DiaperMutationContext from "../../../contexts/diaper-mutation-context";
import axios from "../../../utils/axios";
import BrandSection from "./components/BrandSection";
import TagContext from "../../../contexts/tag-context";
import TagSection from "./components/TagSection";
// import { createBrandsQuery, createTagsQuery } from "./form-queries";
import _ from "lodash";
import "./_create-page.scss";

const EditPage = (props) => {
  const [brand, setBrand] = useState({
    id: `tmp-${Date.now()}`,
    mutation: true,
  });
  const [changePageType, setChangePageType] = useState("create");
  const [existingTags, setExistingTags] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [newTags, setNewTags] = useState([]);

  useEffect(() => {
    axios({
      method: "POST",
      url: "/",
      data: {
        query: `
          {
            tags (order_by: "category:asc,name:asc") {
              id
              name
              category
            }
          }
        `,
      },
    }).then(({ data: { data: { tags = [] } = {} } = {} }) => {
      setExistingTags(tags);
    });
    props.match.params.brandName && setChangePageType("update");
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
        setBrand(brand);
      });
  }, []);

  const addNewTag = () => {
    setNewTags(newTags.concat([{ id: `tmp-${Date.now()}` }]));
  };

  const changeNewTag = (newTag) => {
    const idx = _.findIndex(newTags, { id: newTag.id });
    setNewTags([...newTags.slice(0, idx), newTag, ...newTags.slice(idx + 1)]);
  };

  const removeNewTag = (newTag) => {
    const idx = _.findIndex(newTags, { id: newTag.id });
    setNewTags([...newTags.slice(0, idx), ...newTags.slice(idx + 1)]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("WOOHOO!");
  };

  const changeBrand = (brand) => {
    setBrand(brand)
  }

  // const handleSubmit = () => {
  //   Promise.all([createBrandsQuery([brand]), createTagsQuery(newTags)])
  //     .then(([brandsResult, tagsResult]) => {
  //       brandsResult && setBrand(brandsResult[0]);
  //       tagsResult && setNewTags(tagsResult);
  //     })
  //     .catch((error) => {
  //       console.log("error", error);
  //       setIsAuthorized(false);
  //     });
  // };

  return (
    <DiaperMutationContext.Provider
      value={{ changePageType }}
    >
      <TagContext.Provider
        value={{ existingTags, newTags, addNewTag, changeNewTag, removeNewTag }}
      >
        <section className="create-page page">
          {!isAuthorized ? (
            <div>Not authorized. Please login again.</div>
          ) : null}
          <form onSubmit={handleSubmit}>
            <div>
              <h3>Brand</h3>
              <BrandSection brand={brand} onChange={changeBrand} />
            </div>
            <TagSection />
            <button type="submit">Submit</button>
          </form>
          {JSON.stringify(brand)}
        </section>
      </TagContext.Provider>
    </DiaperMutationContext.Provider>
  );
};

export default EditPage;

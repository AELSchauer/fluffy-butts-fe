import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import CreateBrand from "./components/BrandSection";
import TagContext from "../../../contexts/tag-context";
import TagSection from "./components/TagSection";
import { createBrandsQuery, createTagsQuery } from "./form-queries";
import _ from "lodash";
import "./_create-page.scss";

const CreatePage = () => {
  const [brand, setBrand] = useState({ id: `tmp-${Date.now()}` });
  const [existingTags, setExistingTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(true);

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

  const handleSubmit = () => {
    Promise.all([createBrandsQuery([brand]), createTagsQuery(newTags)])
      .then(([brandsResult, tagsResult]) => {
        brandsResult && setBrand(brandsResult[0]);
        tagsResult && setNewTags(tagsResult);
      })
      .catch((error) => {
        console.log("error", error);
        setIsAuthorized(false);
      });
  };

  return (
    <TagContext.Provider
      value={{ existingTags, newTags, addNewTag, changeNewTag, removeNewTag }}
    >
      <section className="create-page page">
        {!isAuthorized ? <div>Not authorized. Please login again.</div> : null}
        {/* <form onSubmit={handleSubmit}> */}
        <form onSubmit={handleSubmit}>
          <div>
            <h3>Brand</h3>
            <CreateBrand brand={brand} onChange={setBrand} />
          </div>
          <TagSection />
          {JSON.stringify({ brand, tags: newTags }, null, 2)}
          {/* <button type="submit">Submit</button> */}
          <div onClick={handleSubmit}>Submit</div>
        </form>
      </section>
    </TagContext.Provider>
  );
};

export default CreatePage;

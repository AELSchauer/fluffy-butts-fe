import React, { createContext, useEffect, useState } from "react";
import axios from "../../../utils/axios";
import CreateBrand from "./components/Brand";
import TagContext from "../../../contexts/tag-context";
import TagSection from "./components/TagSection";
// import "./_brand-index-page.scss";

const CreatePage = () => {
  const [brand, setBrand] = useState({});
  const [existingTags, setExistingTags] = useState([]);
  const [newTags, setNewTags] = useState([{}]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/graphql",
      params: {
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
    setNewTags(newTags.concat([{}]))
  }

  const changeNewTag = (tagJson, tagIdx) => {
    setNewTags([
      ...newTags.slice(0, tagIdx),
      JSON.parse(tagJson),
      ...newTags.slice(tagIdx + 1),
    ]);
  };

  const removeNewTag = (tagIdx) => {
    setNewTags([...newTags.slice(0, tagIdx), ...newTags.slice(tagIdx + 1)]);
  };

  return (
    <TagContext.Provider value={{ existingTags, newTags, changeNewTag, removeNewTag }}>
      <section className="create-page page">
        <form>
          <div>
            <h3>Brand</h3>
            <CreateBrand brand={brand} onChange={setBrand} />
          </div>
          <div>
            <TagSection />
          </div>
        </form>
      </section>
      {JSON.stringify(brand)}
    </TagContext.Provider>
  );
};

export default CreatePage;

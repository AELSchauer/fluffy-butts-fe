import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import groupBy from "lodash.groupby";
import Accordion from "react-bootstrap/Accordion";

const SearchFilter = ({ query }) => {
  const [categories, setCategories] = useState([]);
  const [filterTags, setFilterTags] = useState(query.get("tags") || []);

  const getTags = async () =>
    axios({
      method: "get",
      url: "/tags",
      params: {
        sort: ["category", "name"],
      },
    }).then(({ data: { data = [] } }) => data);

  useEffect(() => {
    async function fetchData() {
      const result = await getTags();
      const categories = groupBy(result, "attributes.category");
      setCategories(categories);
    }
    fetchData();
  }, []);

  const isTagActive = (tagName) => (query.get("tags") || []).includes(tagName);

  const toggleTag = (tagName) => {
    const idx = filterTags.indexOf(tagName);
    const filterTagsTemp =
      idx < 0 ? filterTags.concat(tagName) : filterTags.splice(idx, 1);
    setFilterTags(filterTagsTemp.filter(Boolean).sort());
  };

  return (
    <div className="product-search">
      {Object.entries(categories).map(([categoryName, tags], index) => {
        return (
          <div className="category-group" key={index}>
            <Accordion>
              <Accordion.Toggle
                as={"h5"}
                eventKey={index}
                className="category-header"
              >
                <i className="fas fa-caret-right" />
                <span>{categoryName}</span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={index}>
                <ul className="category-tags">
                  {tags.map((tag) => {
                    return (
                      <li className="category-tag">
                        <input
                          type="checkbox"
                          checked={isTagActive(tag.attributes.name)}
                          id={`checkbox-${tag.attributes.name.replace(
                            / /g,
                            "-"
                          )}`}
                          onChange={() => toggleTag(tag.attributes.name)}
                        />
                        <label
                          htmlFor={`checkbox-${tag.attributes.name.replace(
                            / /g,
                            "-"
                          )}`}
                        >
                          {tag.attributes.name}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </Accordion.Collapse>
            </Accordion>
          </div>
        );
        // return (
        //   <div className="category-group" key={index}>
        //     <h5 className="category-header">
        //       <i className="fas fa-caret-right" />
        //       <span>{categoryName}</span>
        //     </h5>
        //     <ul className="category-tags">
        //       {tags.map((tag) => {
        //         return (
        //           <li className="category-tag">
        //             <input
        //               type="checkbox"
        //               checked={isTagActive(tag.attributes.name)}
        //               id={`checkbox-${tag.attributes.name.replace(/ /g, "-")}`}
        //               onChange={() => toggleTag(tag.attributes.name)}
        //             />
        //             <label
        //               htmlFor={`checkbox-${tag.attributes.name.replace(
        //                 / /g,
        //                 "-"
        //               )}`}
        //             >
        //               {tag.attributes.name}
        //             </label>
        //           </li>
        //         );
        //       })}
        //     </ul>
        //   </div>
        // );
      })}
    </div>
  );
};

export default SearchFilter;

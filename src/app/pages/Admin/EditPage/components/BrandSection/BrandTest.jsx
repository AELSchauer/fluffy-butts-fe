import _ from "lodash";
import React, { useContext } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import PatternSection from "../PatternSection/PatternSectionTest";
import "./_brand-section.scss";

const BrandTest = ({ path }) => {
  const { rootData, onChange } = useContext(DiaperMutationContext);

  return (
    <div>
      <div className="info-display">
        <label>ID</label>
        <input type="text" value={_.get(rootData, [...path, "id"])} disabled />
        <label>Name</label>
        <input
          type="text"
          required
          value={_.get(rootData, [...path, "name"])}
          onChange={(e) =>
            onChange(
              path,
              Object.assign(_.get(rootData, path), {
                name: e.target.value,
                mutation: true,
              })
            )
          }
        />
      </div>
      <PatternSection path={[...path, "patterns"]} />
    </div>
  );
};

export default BrandTest;

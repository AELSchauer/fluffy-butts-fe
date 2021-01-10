import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context"

import "./_brand-section.scss";

const BrandTest = ({ path, rootData }) => {
  const { changeRootData } = useContext(DiaperMutationContext)
  const [brand, setBrand] = useState({
    id: `tmp-${Date.now()}`,
    mutation: true,
  });

  useEffect(() => {
    !!rootData && setBrand(_.get(rootData, path));
    console.log(brand);
  });

  const changeBrand = (path, data) => {
    changeRootData(path, data);
    setBrand(data);
  };

  return (
    <div className="info-display">
      <label>ID</label>
      <input type="text" value={brand.id} disabled />
      <label>Name</label>
      <input
        type="text"
        required
        value={brand.name}
        onChange={(e) =>
          changeBrand(path, {
            ...brand,
            name: e.target.value,
            mutation: true,
          })
        }
      />
    </div>
  );
};

export default BrandTest;

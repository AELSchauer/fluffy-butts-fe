import _ from "lodash";
import React, { useContext, useState } from "react";
import DiaperMutationContext from "../../../../../contexts/diaper-mutation-context";
import Input from "../FormElements/Input";
import PatternSection from "../PatternSection";
import ProductLineSection from "../ProductLineSection";
import "./_brand-section.scss";

const Brand = ({ path }) => {
  const { state } = useContext(DiaperMutationContext);
  const [brand, setBrand] = useState(_.get(state, path));

  return (
    <div>
      <div className="info-display">
        <Input disabled fieldName="id" path={path} title="ID" />
        <Input fieldName="name" path={path} onChange={setBrand} />
      </div>
      <PatternSection path={[...path, "patterns"]} />
      <ProductLineSection path={[...path, "productLines"]} />
    </div>
  );
};

export default Brand;

import React from "react";
import _ from "lodash";
import { toTitleCase } from "../../../../utils/case-helper";
import "./sizing-table.scss";

const ProductPage = ({ sizing }) => {
  if (!sizing) return "";

  const conversion = {
    kg: {
      lb: 2.20462,
    },
    lb: {
      kg: 0.45359,
    },
    cm: {
      in: 0.393701,
    },
    in: {
      cm: 2.54,
    },
  };
  const tableHasName = !sizing.every(({ name }) => name === "one size");
  const tableHasWeight = sizing.every(({ weight }) => weight);
  const tableDimensions = _.chain(sizing)
    .reduce(
      (tableDimensions, { dimensions = {} }) =>
        tableDimensions.concat(Object.keys(dimensions)),
      []
    )
    .sort()
    .uniq()
    .value();

  const renderHeaderRow = () => {
    return (
      <thead>
        <tr>
          {tableHasName ? <th>Name</th> : ""}
          {tableHasWeight ? (
            <React.Fragment>
              <th>
                <div>Weight</div>
                <div>(kg)</div>
              </th>
              <th>
                <div>Weight</div>
                <div>(lb)</div>
              </th>
            </React.Fragment>
          ) : (
            ""
          )}
          {tableDimensions.map((key) => (
            <React.Fragment>
              <th>
                <div>{toTitleCase(key)}</div>
                <div>(cm)</div>
              </th>
              <th>
                <div>{toTitleCase(key)}</div>
                <div>(in)</div>
              </th>
            </React.Fragment>
          ))}
        </tr>
      </thead>
    );
  };

  const buildSizing = (sizes = [], unit) => {
    if (!sizes.length) {
      return false;
    }
    return (
      (sizes.find((x) => x.unit === unit) || {}).num ||
      Math.round(sizes[0].num * conversion[sizes[0].unit][unit] * 10) / 10
    );
  };

  const renderContentRow = ({
    name,
    weight: { min = [], max = [] } = {},
    dimensions,
  }, idx) => {
    return (
      <tr key={idx}>
        {tableHasName ? <td>{name}</td> : ""}
        {tableHasWeight
          ? ["kg", "lb"].map((unit) => {
              const minWt = buildSizing(min, unit);
              const maxWt = buildSizing(max, unit);
              return (
                <td key={unit}>
                  {minWt ? minWt : "<"}
                  {minWt && maxWt
                    ? " - ".replace(/ /g, "\u00a0").replace(/-/g, "\u2011")
                    : ""}
                  {maxWt ? maxWt : "+"}
                </td>
              );
            })
          : ""}
        {tableDimensions.map((key, idx) =>
          ["cm", "in"].map((unit) => {
            const minDm = buildSizing(dimensions[key].min, unit);
            const maxDm = buildSizing(dimensions[key].max, unit);
            return (
              <td key={idx}>
                {minDm ? minDm : ""}
                {minDm && maxDm
                  ? " - ".replace(/ /g, "\u00a0").replace(/-/g, "\u2011")
                  : ""}
                {maxDm ? maxDm : "+"}
              </td>
            );
          })
        )}
      </tr>
    );
  };

  return (
    <table className="sizing-table">
      {renderHeaderRow()}
      <tbody>
        {_.sortBy(sizing, ["sortOrder", "name"], ['asc', 'asc']).map(renderContentRow)}
      </tbody>
    </table>
  );
};

export default ProductPage;

import React from "react";

const ColumnFiltering = (param) => {
  const { filterValue, setFilter } = param.column;
  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
    ></input>
  );
};

export default ColumnFiltering;

import React from "react";
import MaterialTable from "material-table";

const Table = ({ data }) => {
  const columns = [
    { title: "Volume/Day", field: "y" },
    { title: "Date Captured", field: "x", type: "date" }
  ];

  return (
    <>
      <MaterialTable
        style={{ height: "50vh", width: "100%" }}
        columns={columns}
        data={data}
        title="Yarra Municipality Traffic Count"
      />
    </>
  );
};

export default Table;

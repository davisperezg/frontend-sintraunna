import { useTable } from "react-table";
import { ITable } from "../../interface/Table";
import { Table } from "../../views/IndexStyle";
import ActionsButtons from "./EgresoAccionesList";

const EgresoList = ({
  columns,
  data,
  handleClickOpen,
  handleClickDetails,
}: ITable) => {
  const tableHooks = (hooks: any) => {
    hooks.visibleColumns.push((columns: any) => [
      ...columns,
      {
        id: "actions",
        Header: "Acciones",
        Cell: ({ row }: any) => {
          const values = row.original;
          return (
            <ActionsButtons
              row={values}
              handleClickOpen={handleClickOpen}
              handleClickDetails={handleClickDetails}
            />
          );
        },
      },
    ]);
  };

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      tableHooks
    );

  // Render the UI for your table
  return (
    <Table>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Table>
  );
};

export default EgresoList;

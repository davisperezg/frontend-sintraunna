import { Button, MenuItem, Skeleton } from "@mui/material";
import { MouseEvent, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTable } from "react-table";
import { Table } from "./PermissionsCStyle";
import { StyledMenu } from "../General/CSSIndex";

const ActionesButton = ({ ...rest }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const openEdit = (id: string) => {
    rest.handleClickOpen(id);
    handleClose();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {rest.row.status && (
          <MenuItem onClick={() => openEdit(rest.row._id)} disableRipple>
            Editar
          </MenuItem>
        )}
      </StyledMenu>
    </div>
  );
};

const PermissionsList = ({
  columns,
  data,
  isLoading,
  handleClickOpen,
}: any) => {
  const tableHooks = (hooks: any) => {
    hooks.visibleColumns.push((columns: any) => [
      ...columns,
      {
        id: "actions",
        Header: "Acciones",
        Cell: ({ row }: any) => {
          const values = row.original;
          return (
            <ActionesButton row={values} handleClickOpen={handleClickOpen} />
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
      {isLoading ? (
        <Skeleton animation="wave" variant="rectangular" height={500} />
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
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
      )}
    </Table>
  );
};

export default PermissionsList;

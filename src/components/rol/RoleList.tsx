import { Button, Menu, MenuItem, MenuProps, Skeleton } from "@mui/material";
import { MouseEvent, useState } from "react";
import { useTable } from "react-table";
import { Table } from "./RoleCStyle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled, alpha } from "@mui/material/styles";
import { useDeleteRole, useRestoreRol } from "../hooks/useRoles";
import { toast } from "react-toastify";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const ActionesButton = ({ ...rest }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useDeleteRole();

  const { mutate: mutateRestore, isLoading: isLoadingRestore } =
    useRestoreRol();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const restoreRole = (id: string) => {
    mutateRestore(
      {
        id: id,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (e) => {
          const error: Error = JSON.parse(e.request.response);
          toast.error(error.message);
        },
      }
    );
  };

  const desactivateRol = (id: string) => {
    mutateDelete(
      {
        id: id,
      },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (e) => {
          const error: Error = JSON.parse(e.request.response);
          toast.error(error.message);
        },
      }
    );
  };

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
        <MenuItem onClick={() => openEdit(rest.row._id)} disableRipple>
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (rest.row.status) {
              return desactivateRol(rest.row._id);
            } else {
              return restoreRole(rest.row._id);
            }
          }}
          disableRipple
        >
          {rest.row.status
            ? isLoadingDelete
              ? "Elimnando..."
              : "Desactivar"
            : isLoadingRestore
            ? "Restaurando..."
            : "Restaurar"}
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

const RoleList = ({ columns, data, isLoading, handleClickOpen }: any) => {
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

export default RoleList;

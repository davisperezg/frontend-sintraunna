import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { StyledMenu } from "../General/CSSIndex";
import { toast } from "react-toastify";
import { useState, MouseEvent } from "react";
import { useDeleteGrupo, useRestoreGrupo } from "../hooks/useGrupos";
import { useAccess } from "../hooks/useResources";

const GrupoAccionsList = ({ ...rest }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openDelete, setOpenDelete] = useState(false);
  const [openRestore, setOpenRestore] = useState(false);
  const {
    data: dataAccess,
    isLoading: isLoadingAccess,
    isError: isErrorAccess,
    error: errorAccess,
  } = useAccess();

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useDeleteGrupo();

  const { mutate: mutateRestore, isLoading: isLoadingRestore } =
    useRestoreGrupo();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenAnular = () => {
    setOpenDelete(true);
    handleClose();
  };

  const handleClickRestore = () => {
    setOpenRestore(true);
    handleClose();
  };

  const handleCloseAnular = () => {
    setOpenDelete(false);
  };

  const handleCloseRestore = () => {
    setOpenRestore(false);
  };

  const restoreEgres = (id: string) => {
    mutateRestore(
      {
        id: id,
      },
      {
        onSuccess: () => {
          handleClose();
          handleCloseRestore();
        },
        onError: (e) => {
          const error: Error = JSON.parse(e.request.response);
          toast.error(error.message);
        },
      }
    );
  };

  const desactivateEgres = async (id: string) => {
    mutateDelete(
      {
        id: id,
      },
      {
        onSuccess: () => {
          handleClose();
          handleCloseAnular();
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
      <Dialog
        open={openDelete}
        onClose={handleCloseAnular}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Eliminar Grupo?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Esta seguro que desea eliminar al grupo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => desactivateEgres(rest.row._id)} autoFocus>
            Eliminar de todas formas
          </Button>
          <Button variant="contained" onClick={handleCloseAnular}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRestore}
        onClose={handleCloseRestore}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Restaurar Grupo?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Esta seguro que desea restaurar el grupo?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => restoreEgres(rest.row._id)} autoFocus>
            Restaurar de todas formas
          </Button>
          <Button variant="contained" onClick={handleCloseRestore}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

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
          <>
            {isLoadingAccess
              ? "Verificando permisos..."
              : isErrorAccess
              ? "Ha ocurrido un error por favor comunicarse al soporte"
              : dataAccess.some((a: any) => a === "canEdit_grupos") && (
                  <MenuItem
                    onClick={() => openEdit(rest.row._id)}
                    disableRipple
                  >
                    Editar
                  </MenuItem>
                )}
          </>
        )}
        {
          <>
            {isLoadingAccess
              ? "Verificando permisos..."
              : isErrorAccess
              ? "Ha ocurrido un error por favor comunicarse al soporte"
              : dataAccess.some(
                  (a: any) =>
                    a === "canDelete_grupos" || a === "canRestore_grupos"
                ) && (
                  <>
                    <MenuItem
                      onClick={() => {
                        if (
                          dataAccess.some((a: any) => a === "canDelete_grupos")
                        ) {
                          if (rest.row.status) {
                            return handleClickOpenAnular();
                          }
                        }

                        if (
                          dataAccess.some((a: any) => a === "canRestore_grupos")
                        ) {
                          if (!rest.row.status) {
                            return handleClickRestore();
                          }
                        }
                      }}
                      disableRipple
                    >
                      {rest.row.status ? (
                        isLoadingDelete ? (
                          "Eliminando..."
                        ) : (
                          <>
                            {dataAccess.some(
                              (a: any) => a === "canDelete_grupos"
                            ) && "Eliminar"}
                          </>
                        )
                      ) : isLoadingRestore ? (
                        "Restaurando..."
                      ) : (
                        <>
                          {dataAccess.some(
                            (a: any) => a === "canRestore_grupos"
                          ) && "Restaurar"}
                        </>
                      )}
                    </MenuItem>
                  </>
                )}
          </>
        }
      </StyledMenu>
    </div>
  );
};

export default GrupoAccionsList;

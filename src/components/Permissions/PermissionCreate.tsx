import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { useState } from "react";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { Permission } from "../../interface/Permission";
import { toast } from "react-toastify";
import { useMuateResource } from "../hooks/useResources";

interface Props {
  handleClose: () => void;
  open: boolean;
}

const initialState: Permission = {
  name: "",
  description: "",
  key: "",
};

const PermissionCreate = ({ handleClose, open }: Props) => {
  const [permisssion, setPermission] = useState<Permission>(initialState);
  const { mutateAsync: mutateCP, isLoading: isLoadingCP } = useMuateResource();

  const handleChange = <P extends keyof Permission>(
    prop: P,
    value: Permission[P]
  ) => setPermission({ ...permisssion, [prop]: value });

  const handleOk = async () => {
    try {
      await mutateCP({
        body: permisssion,
      });
      toast.success("Usuario registrado. !");
      clearValues();
      handleClose();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const clearValues = () => setPermission(initialState);

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Nuevo Permiso
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 3, width: "100%", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  required
                  value={permisssion.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  id="name-required"
                  label="Nombre"
                  autoComplete="off"
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  required
                  value={permisssion.key}
                  onChange={(e) => handleChange("key", e.target.value)}
                  id="key-required"
                  label="Key"
                  autoComplete="off"
                />
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  value={permisssion.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  id="description-required"
                  label="Descripción"
                  autoComplete="off"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={handleOk}
            disabled={isLoadingCP}
          >
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default PermissionCreate;

import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  TextField,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Permission } from "../../interface/Permission";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { useMuateResource, useResourcesByIdCrud } from "../hooks/useResources";
import { toast } from "react-toastify";

interface Props {
  handleClose: () => void;
  open: boolean;
  permissionId: string;
}

const initialState: Permission = {
  _id: "",
  name: "",
  description: "",
  key: "",
};

const PermissionEdit = ({ handleClose, open, permissionId }: Props) => {
  const [permisssion, setPermission] = useState<Permission>(initialState);
  const {
    data: dataGetResource,
    isLoading: isLoadingGetResource,
    isError: isErrorGetResource,
    error: errorGetResource,
  } = useResourcesByIdCrud(permissionId);
  const { mutateAsync: mutateCP, isLoading: isLoadingCP } = useMuateResource();

  const handleChange = <P extends keyof Permission>(
    prop: P,
    value: Permission[P]
  ) => setPermission({ ...permisssion, [prop]: value });

  const loadModule = useCallback(() => {
    if (dataGetResource) {
      setPermission({
        _id: dataGetResource._id,
        name: dataGetResource.name,
        description: dataGetResource.description,
        key: dataGetResource.key,
      });
    }
  }, [dataGetResource]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const handleOk = async () => {
    try {
      await mutateCP({
        body: permisssion,
        idUpdateData: permissionId,
      });
      toast.success("Modulo actualizado. !");
      setPermission(initialState);
      handleClose();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {isLoadingGetResource ? (
          "Obteniendo datos..."
        ) : isErrorGetResource ? (
          JSON.parse(String(errorGetResource?.request.response)).message
        ) : (
          <>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Permiso - {permisssion?.name}
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
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
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
          </>
        )}
      </BootstrapDialog>
    </>
  );
};

export default PermissionEdit;

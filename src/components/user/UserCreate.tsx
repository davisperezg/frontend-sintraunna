import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { User } from "../../interface/User";
import { useRoles } from "../hooks/useRoles";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { useMutateUser } from "../hooks/useUsers";
import { toast } from "react-toastify";
import { rolSA } from "../../consts/const";

interface Props {
  handleClose: () => void;
  open: boolean;
}

const initialState: User = {
  role: "",
  tipDocument: "",
  nroDocument: "",
  name: "",
  lastname: "",
  email: "",
  password: "",
};

const UserCreate = ({ handleClose, open }: Props) => {
  const { data: roles, isLoading, isError, error } = useRoles();
  const [user, setUser] = useState<User>(initialState);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateUser();

  const handleChange = <P extends keyof User>(prop: P, value: User[P]) => {
    setUser({ ...user, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataUser: user,
      });
      toast.success("Usuario registrado. !");
      handleCloseLocal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const clearValues = () => setUser(initialState);

  const handleCloseLocal = () => {
    clearValues();
    handleClose();
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleCloseLocal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseLocal}
        >
          Nuevo Usuario
        </BootstrapDialogTitle>
        <DialogContent dividers>
          {isError && (
            <Alert severity="error">
              {JSON.parse(String(error?.request.response)).message}
            </Alert>
          )}
          <Box sx={{ p: 3, width: "100%", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControl fullWidth>
                  {/* <InputLabel id="role-select-label">Rol *</InputLabel> */}
                  <Select
                    required
                    labelId="role-select-label"
                    id="tipDoc-select"
                    value={user.role as string}
                    displayEmpty
                    // label="Rol"
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    <MenuItem disabled value="">
                      [Seleccione un rol]
                    </MenuItem>
                    {isLoading ? (
                      <MenuItem>Cargando roles...</MenuItem>
                    ) : roles?.length === 0 ? (
                      <MenuItem disabled={true} value="vaciox">
                        <strong style={{ color: "red" }}>
                          No se encontró ningún rol. Por favor crea uno nuevo.
                        </strong>
                      </MenuItem>
                    ) : (
                      roles?.map((role) => {
                        return (
                          role.name !== rolSA && (
                            <MenuItem
                              disabled={role.status ? false : true}
                              key={role._id}
                              value={role._id}
                            >
                              {role.name} - {role.creator}
                            </MenuItem>
                          )
                        );
                      })
                    )}
                    {/* {roles?.map((role) => (
                          <MenuItem
                            disabled={role.status ? false : true}
                            key={role._id}
                            value={role._id}
                          >
                            {role.name} - {role.creator}
                          </MenuItem>
                        ))} */}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel id="tipDoc-select-label">
                    Tipo de documento *
                  </InputLabel>
                  <Select
                    required
                    labelId="tipDoc-select-label"
                    id="tipDoc-select"
                    value={user.tipDocument}
                    label="Tipo de documento"
                    onChange={(e) =>
                      handleChange("tipDocument", e.target.value)
                    }
                  >
                    <MenuItem value="DNI">DNI</MenuItem>
                    <MenuItem value="RUC">RUC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  onChange={(e) => handleChange("nroDocument", e.target.value)}
                  id="nro-required"
                  label="Nro. de documento"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  onChange={(e) => handleChange("name", e.target.value)}
                  id="name-required"
                  label="Nombres"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  onChange={(e) => handleChange("lastname", e.target.value)}
                  id="lastname-required"
                  label="Apellidos"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  onChange={(e) => handleChange("email", e.target.value)}
                  fullWidth
                  required
                  autoComplete="off"
                  id="email-required"
                  label="Email"
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  required
                  autoComplete="off"
                  onChange={(e) => handleChange("password", e.target.value)}
                  id="password-required"
                  label="Contraseña"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseLocal}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={handleOk}
            disabled={isLoadingMutate}
          >
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default UserCreate;

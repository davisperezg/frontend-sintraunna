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
} from "@mui/material";
import { useState } from "react";
import { User } from "../../interface/User";
import { useRoles } from "../hooks/useRoles";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { useMutateUser } from "../hooks/useUsers";
import { toast } from "react-toastify";

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
  const { data: roles } = useRoles();
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
      clearValues();
      handleClose();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const clearValues = () => {
    setUser(initialState);
  };

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
          Nuevo Usuario
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ p: 3, width: "100%", height: "100%" }}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <InputLabel id="role-select-label">Rol *</InputLabel>
                  <Select
                    required
                    labelId="role-select-label"
                    id="tipDoc-select"
                    value={user.role as string}
                    label="Rol"
                    onChange={(e) => handleChange("role", e.target.value)}
                  >
                    {roles?.map((role) => (
                      <MenuItem key={role._id} value={role._id}>
                        {role.name}
                      </MenuItem>
                    ))}
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
          <Button variant="outlined" onClick={handleClose}>
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

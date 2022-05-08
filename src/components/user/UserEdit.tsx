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
  Tab,
  Tabs,
  FormGroup,
  Alert,
} from "@mui/material";

import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { User } from "../../interface/User";
import { useRoles } from "../hooks/useRoles";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { useMutateUser, useUser, useChangePassword } from "../hooks/useUsers";
import { toast } from "react-toastify";
import {
  useMutateResourceUser,
  useResources,
  useResourcesByUser,
} from "../hooks/useResources";
import CheckBoxItem from "../checkbox/CheckBoxItem";
import {
  useModules,
  useModulesByUser,
  useMutateServicesUser,
} from "../hooks/useModules";
import { ErrorServer } from "../../interface/Error";

interface Props {
  handleClose: () => void;
  open: boolean;
  userId: string;
}

const initialState: User = {
  _id: "",
  role: "",
  tipDocument: "",
  nroDocument: "",
  name: "",
  lastname: "",
  email: "",
  roleId: "",
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{
        height: "calc(100% - 49px)",
        overflow: "auto",
      }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserEdit = ({ handleClose, open, userId }: Props) => {
  const {
    data: roles,
    isLoading: isLoadingListRoles,
    isError: isErrorListRoles,
    error: errorListRoles,
  } = useRoles();
  const [user, setUser] = useState<User>(initialState);
  const [password, setPassword] = useState({
    password: "",
  });
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateUser();
  const { mutateAsync: mutatePassword, isLoading: isLoadingPassword } =
    useChangePassword();
  const {
    data,
    isLoading,
    isError: isErrorGetUser,
    error: errorGetUser,
  } = useUser(userId);
  const [value, setValue] = useState(0);
  const {
    data: resources,
    isLoading: isLoadingResources,
    isError: isErrorListResources,
    error: errorListResources,
  } = useResources();
  const [permisosSelected, setPermisosSelected] = useState<string[]>([]);
  const [modulesSelected, setModulesSelected] = useState<string[]>([]);
  const {
    data: resourcesByUsers,
    isLoading: isLoadingRUsers,
    isError: isErrorRUser,
    error: errorRUser,
  } = useResourcesByUser(userId);
  const {
    mutateAsync: mutateResourceUser,
    isLoading: isLoadingMutateResourceUser,
  } = useMutateResourceUser();

  const {
    data: modulesOfUser,
    isLoading: isLoadingModulesOfUser,
    isError: isErrorGetModulesByUser,
    error: errorGetModulesByUser,
  } = useModulesByUser(userId);
  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorListModules,
    error: errorListModules,
  } = useModules();
  const {
    mutateAsync: mutateServiceUser,
    isLoading: isLoadingMutateServiceUser,
  } = useMutateServicesUser();

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof User>(prop: P, value: User[P]) => {
    setUser({ ...user, [prop]: value });
  };

  const handleChangePassword = <P extends keyof User>(
    prop: P,
    value: User[P]
  ) => {
    setPassword({ ...password, [prop]: value });
  };

  const handleCheckPermisos = (value: string[]) => {
    setPermisosSelected(value);
  };

  const handleCheckModules = (value: string[]) => {
    setModulesSelected(value);
  };

  const handleOk = async () => {
    //Si completa el campo cambiar password debe tener minimo 6 caracteres
    if (password.password.length !== 0 && password.password.length <= 5) {
      toast.error("El campo contraseña debe tener minimo 6 caracteres.");
    } else {
      if (password.password.length >= 6) {
        try {
          await mutatePassword({
            id: String(user._id),
            body: password,
          });
          toast.success("Contraseña actualizada. !");
        } catch (e: any) {
          const error: ErrorServer = JSON.parse(e.request.response);
          toast.error(error.message);
        }
      }

      try {
        //mutate usuario
        await mutateAsync({
          dataUser: user,
          idUpdateData: user._id,
        });
        await mutateResourceUser({
          body: {
            user: userId,
            resource: permisosSelected,
          },
        });
        await mutateServiceUser({
          body: {
            user: userId,
            module: modulesSelected,
          },
        });
        toast.success("Usuario actualizado. !");
        setUser(initialState);
        handleClose();
      } catch (e: any) {
        const error: ErrorServer = JSON.parse(e.request.response);
        toast.error(error.message);
      }
    }
  };

  const loadUser = useCallback(() => {
    if (data)
      setUser({
        _id: data?._id,
        role: data?.roleId as string,
        tipDocument: data?.tipDocument,
        nroDocument: data?.nroDocument,
        name: data?.name,
        lastname: data?.lastname,
        email: data?.email,
        roleId: data?.roleId,
      });

    setPermisosSelected(resourcesByUsers);
    const formatedModules = modulesOfUser?.map((mod: any) => mod._id) || [];
    setModulesSelected(formatedModules);
  }, [data, resourcesByUsers, modulesOfUser]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {isLoading ? (
          "Obteniendo datos..."
        ) : isErrorGetUser ? (
          JSON.parse(String(errorGetUser?.request.response)).message
        ) : (
          <>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Usuario - {data?.fullname}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {isErrorGetModulesByUser && (
                <Alert severity="error">
                  {
                    JSON.parse(String(errorGetModulesByUser?.request.response))
                      .message
                  }
                </Alert>
              )}
              {isErrorListRoles && (
                <Alert severity="error">
                  {JSON.parse(String(errorListRoles?.request.response)).message}
                </Alert>
              )}
              {isErrorListModules && (
                <Alert severity="error">
                  {
                    JSON.parse(String(errorListModules?.request.response))
                      .message
                  }
                </Alert>
              )}
              {isErrorListResources && (
                <Alert severity="error">
                  {
                    JSON.parse(String(errorListResources?.request.response))
                      .message
                  }
                </Alert>
              )}
              {isErrorRUser && (
                <Alert severity="error">
                  {JSON.parse(String(errorRUser?.request.response)).message}
                </Alert>
              )}
              <Box sx={{ width: "100%", height: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChangeTab}
                    aria-label="basic tabs example"
                  >
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Cambiar contraseña" {...a11yProps(1)} />
                    <Tab label="Servicios" {...a11yProps(2)} />
                    <Tab label="Permisos" {...a11yProps(3)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
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
                          {isLoadingListRoles ? (
                            <MenuItem>Cargando roles...</MenuItem>
                          ) : (
                            roles?.map((role) => (
                              <MenuItem
                                key={role._id}
                                disabled={role.status ? false : true}
                                value={role._id}
                              >
                                {role.name} - {role.creator}
                              </MenuItem>
                            ))
                          )}
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
                        value={user.nroDocument}
                        onChange={(e) =>
                          handleChange("nroDocument", e.target.value)
                        }
                        autoComplete="off"
                        id="nro-required"
                        label="Nro. de documento"
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        fullWidth
                        required
                        value={user.name}
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
                        value={user.lastname}
                        autoComplete="off"
                        onChange={(e) =>
                          handleChange("lastname", e.target.value)
                        }
                        id="lastname-required"
                        label="Apellidos"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        onChange={(e) => handleChange("email", e.target.value)}
                        fullWidth
                        autoComplete="off"
                        required
                        value={user.email}
                        id="email-required"
                        label="Email"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        autoComplete="off"
                        value={password.password}
                        onChange={(e) =>
                          handleChangePassword("password", e.target.value)
                        }
                        id="password-required"
                        label="Nueva contraseña"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <FormGroup>
                    <CheckBoxItem
                      options={isLoadingModules ? [] : (modules as [])}
                      value={isLoadingModulesOfUser ? [] : modulesSelected}
                      handleChange={handleCheckModules}
                    />
                  </FormGroup>
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <FormGroup>
                    <CheckBoxItem
                      options={isLoadingResources ? [] : resources}
                      value={isLoadingRUsers ? [] : permisosSelected}
                      handleChange={handleCheckPermisos}
                    />
                  </FormGroup>
                </TabPanel>
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
                disabled={
                  isLoadingPassword
                    ? true
                    : isLoadingMutate
                    ? true
                    : isLoadingMutateResourceUser
                    ? true
                    : isLoadingMutateServiceUser
                    ? true
                    : false
                }
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

export default UserEdit;

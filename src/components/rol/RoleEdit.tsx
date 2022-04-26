import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  FormGroup,
} from "@mui/material";

import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useMutateRole, useRole } from "../hooks/useRoles";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { toast } from "react-toastify";
import { Role } from "../../interface/Role";
import { useModules } from "../hooks/useModules";
import CheckBoxItem from "../checkbox/CheckBoxItem";
import {
  useMutateResourceRol,
  useResources,
  useResourcesByRol,
} from "../hooks/useResources";
import { SA } from "../../consts/const";
import { ErrorServer } from "../../interface/Error";

interface Props {
  handleClose: () => void;
  open: boolean;
  roleId: string;
}

const initialState: Role = {
  _id: "",
  name: "",
  module: [],
  description: "",
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
      {...other}
      style={{
        height: "calc(100% - 49px)",
        overflow: "auto",
      }}
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

const RoleEdit = ({ handleClose, open, roleId }: Props) => {
  const { data: modules, isLoading: isLoadingModules } = useModules();
  const { data: resources, isLoading: isLoadingResources } = useResources();
  const [role, setRole] = useState<Role>(initialState);
  const [moduleSelected, setModuleSelected] = useState<string[]>([]);
  const [permisosSelected, setPermisosSelected] = useState<string[]>([]);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateRole();
  const { mutateAsync: mutateResource, isLoading: isLoadingMutateResource } =
    useMutateResourceRol();
  const { data, isLoading } = useRole(roleId);
  const { data: dataAccess, isLoading: isLoadingAccess } =
    useResourcesByRol(roleId);
  const [value, setValue] = useState(0);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof Role>(prop: P, value: Role[P]) => {
    setRole({ ...role, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataRole: { ...role, module: moduleSelected },
        idUpdateData: role._id,
      });
      await mutateResource({
        body: {
          role: roleId,
          resource: permisosSelected,
        },
      });
      toast.success("Rol actualizado. !");
      setRole(initialState);
      handleClose();
    } catch (e: any) {
      const error: ErrorServer = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleCheckModules = (value: string[]) => {
    setModuleSelected(value);
  };

  const handleCheckPermisos = (value: string[]) => {
    setPermisosSelected(value);
  };

  const loadRole = useCallback(() => {
    if (data)
      setRole({
        _id: data?._id,
        name: data?.name,
        description: data?.description ? data?.description : "",
        module: data?.module,
      });

    setModuleSelected(data?.module as []);
    setPermisosSelected(dataAccess);
  }, [data, dataAccess]);

  useEffect(() => {
    loadRole();
  }, [loadRole]);

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {isLoading ? (
          "Obteniendo datos..."
        ) : (
          <>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Rol - {data?.name}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              <Box sx={{ width: "100%", height: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={value}
                    onChange={handleChangeTab}
                    aria-label="basic tabs example"
                  >
                    <Tab label="General" {...a11yProps(0)} />
                    <Tab label="Modulos" {...a11yProps(1)} />
                    <Tab label="Permisos" {...a11yProps(2)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    {role.name === SA || (
                      <Grid item md={12}>
                        <TextField
                          fullWidth
                          required
                          value={role.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          id="name-required"
                          label="Nombre"
                          autoComplete="off"
                        />
                      </Grid>
                    )}

                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        value={role.description}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        id="description-required"
                        label="Descripción"
                        autoComplete="off"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <FormGroup>
                    <CheckBoxItem
                      options={isLoadingModules ? [] : (modules as [])}
                      value={moduleSelected}
                      handleChange={handleCheckModules}
                    />
                  </FormGroup>
                </TabPanel>
                <TabPanel value={value} index={2}>
                  {isLoadingAccess ? (
                    <p>Cargando recursos...</p>
                  ) : (
                    <FormGroup>
                      <CheckBoxItem
                        options={isLoadingResources ? [] : resources}
                        value={permisosSelected}
                        handleChange={handleCheckPermisos}
                      />
                    </FormGroup>
                  )}
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
                  isLoadingMutate
                    ? true
                    : isLoadingMutateResource
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

export default RoleEdit;

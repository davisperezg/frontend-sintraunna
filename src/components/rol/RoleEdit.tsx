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
  Alert,
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
import { ErrorServer } from "../../interface/Error";
import { resourcesByDefault, rolSA } from "../../consts/const";

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
  const {
    data: modules,
    isLoading: isLoadingModules,
    isError: isErrorListModules,
    error: errorListModules,
  } = useModules();
  const {
    data: resources,
    isLoading: isLoadingResources,
    isError: isErrorListResources,
    error: errorListResources,
  } = useResources();
  const [roleEntity, setRoleEntity] = useState<Role>(initialState);
  const [resToList, setResToList] = useState<any[]>([]);
  const [moduleSelected, setModuleSelected] = useState<string[]>([]);
  const [permisosSelected, setPermisosSelected] = useState<string[]>([]);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateRole();
  const { mutateAsync: mutateResource, isLoading: isLoadingMutateResource } =
    useMutateResourceRol();
  const { data: dataRole, isLoading, isError, error } = useRole(roleId);
  const {
    data: dataAccess,
    //isLoading: isLoadingAccess,
    isError: isErrorGetRRol,
    error: errorGetRRol,
  } = useResourcesByRol(roleId);
  const [value, setValue] = useState(0);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof Role>(prop: P, value: Role[P]) => {
    setRoleEntity({ ...roleEntity, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataRole: { ...roleEntity, module: moduleSelected },
        idUpdateData: roleEntity._id,
      });
      await mutateResource({
        body: {
          role: roleId,
          resource: permisosSelected,
        },
      });
      toast.success("Rol actualizado. !");
      setRoleEntity(initialState);
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
    if (dataRole)
      setRoleEntity({
        _id: dataRole?._id,
        name: dataRole?.name as string,
        description: dataRole?.description,
        module: dataRole?.module as string[],
      });

    setModuleSelected(dataRole?.module as []);

    setPermisosSelected(dataAccess);
  }, [dataRole, dataAccess]);

  const loadRes = useCallback(() => {
    if (dataRole?.name === rolSA) {
      if (resources) {
        const findRes: any[] = [];
        resources.filter((a: any) => {
          resourcesByDefault.filter((b: any) => {
            if (a.value.toLowerCase() === b.key.toLowerCase()) {
              findRes.push(a);
            }
          });
        });
        const difRes = resources.filter((a: any) => !findRes.includes(a));
        const resToOwnerDis = findRes.map((a) => {
          return {
            ...a,
            disabled: true,
          };
        });
        const resToOwnerAct = difRes.map((a: any) => {
          return {
            ...a,
            disabled: false,
          };
        });
        const resourcesToOwner = resToOwnerDis.concat(resToOwnerAct);
        setResToList(resourcesToOwner);
      }
    } else {
      setResToList(resources);
    }
  }, [dataRole?.name, resources]);

  useEffect(() => {
    loadRes();
    loadRole();
  }, [loadRes, loadRole]);

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {isLoading ? (
          "Obteniendo datos..."
        ) : isError ? (
          JSON.parse(String(error?.request.response)).message
        ) : (
          <>
            <BootstrapDialogTitle
              id="customized-dialog-title"
              onClose={handleClose}
            >
              Rol - {dataRole?.name}
            </BootstrapDialogTitle>
            <DialogContent dividers>
              {isErrorGetRRol && (
                <Alert severity="error">
                  {JSON.parse(String(errorGetRRol?.request.response)).message}
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
                    {dataRole?.name !== rolSA && (
                      <Grid item md={12}>
                        <TextField
                          fullWidth
                          required
                          value={roleEntity.name}
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
                        value={roleEntity.description}
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
                  {isLoadingModules ? (
                    "Cargando modulos..."
                  ) : (
                    <FormGroup>
                      <CheckBoxItem
                        options={modules as []}
                        value={moduleSelected}
                        handleChange={handleCheckModules}
                      />
                    </FormGroup>
                  )}
                </TabPanel>
                <TabPanel value={value} index={2}>
                  {isLoadingResources ? (
                    "Cargando recursos..."
                  ) : (
                    <FormGroup>
                      <CheckBoxItem
                        options={resToList}
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

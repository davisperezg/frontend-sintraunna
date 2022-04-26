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

import { SyntheticEvent, useState } from "react";
import { useMutateRole } from "../hooks/useRoles";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { toast } from "react-toastify";
import { Role } from "../../interface/Role";
import { useModules } from "../hooks/useModules";
import CheckBoxItem from "../checkbox/CheckBoxItem";

interface Props {
  handleClose: () => void;
  open: boolean;
}

const initialState: Role = {
  name: "",
  module: [],
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

const RoleCreate = ({ handleClose, open }: Props) => {
  const { data: modules, isLoading: isLoadingModules } = useModules();
  const [role, setRole] = useState<Role>(initialState);
  const [moduleSelected, setModuleSelected] = useState<string[]>([]);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateRole();
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
      });
      toast.success("Rol creado. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleCheckModules = (value: string[]) => {
    setModuleSelected(value);
  };

  const closeModal = () => {
    handleClose();
    setRole(initialState);
    setModuleSelected([]);
  };

  return (
    <>
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          Nuevo Rol
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
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
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
                <Grid item md={12}>
                  <TextField
                    fullWidth
                    value={role.description || ""}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={closeModal}>
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

export default RoleCreate;

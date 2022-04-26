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
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import { toast } from "react-toastify";
import { useModule, useMutateModule } from "../hooks/useModules";
import CheckBoxItem from "../checkbox/CheckBoxItem";
import { useMenus } from "../hooks/useMenus";
import { Module } from "../../interface/Module";
import { Menu } from "../../interface/Menu";

interface Props {
  handleClose: () => void;
  open: boolean;
  moduleId: string;
}

const initialState: Module = {
  _id: "",
  name: "",
  menu: [],
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

const ModuleEdit = ({ handleClose, open, moduleId }: Props) => {
  const { data: menusHook, isLoading: isLoadingMenus } = useMenus();
  const [module, setModule] = useState<Module>(initialState);
  const [menus, setMenus] = useState<any[]>([]);
  const [menusSelected, setMenusSelected] = useState<string[]>([]);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateModule();
  const { data, isLoading } = useModule(moduleId);
  const [value, setValue] = useState(0);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof Module>(prop: P, value: Module[P]) => {
    setModule({ ...module, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataModule: { ...module, menu: menusSelected },
        idUpdateData: module._id,
      });
      toast.success("Modulo actualizado. !");
      setModule(initialState);
      setMenusSelected([]);
      handleClose();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleCheckMenus = (value: string[]) => {
    setMenusSelected(value);
  };

  const loadModule = useCallback(() => {
    if (data)
      setModule({
        _id: data?._id,
        name: data?.name,
        description: data?.description ? data?.description : "",
        menu: data?.menu,
      });

    const menuFormated =
      menusHook?.map((men) => {
        return {
          label: men.name,
          value: men.name,
        };
      }) || [];
    setMenus(menuFormated);

    const selectedFormated = data?.menu.map((men: any) => men.name) || [];

    setMenusSelected(selectedFormated);
  }, [data, menusHook]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

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
              Modulo - {data?.name}
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
                    <Tab label="Menus" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={module.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        id="name-required"
                        label="Nombre"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        value={module.description}
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
                      options={isLoadingMenus ? [] : (menus as [])}
                      value={menusSelected}
                      handleChange={handleCheckMenus}
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
                disabled={isLoadingMutate}
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

export default ModuleEdit;

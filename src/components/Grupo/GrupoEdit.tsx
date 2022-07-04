import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Grupo } from "../../interface/Grupo";
import { IModal } from "../../interface/Modal";
import { a11yProps } from "../../utils/helpers/functions";
import { useGrupo, useMutateGrupo } from "../hooks/useGrupos";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";

const initialGrupo: Grupo = {
  _id: "",
  nombre: "",
  descripcion: "",
};

const GrupoEdit = ({ handleClose, open, entityId }: IModal) => {
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateGrupo();
  const [value, setValue] = useState<number>(0);
  const [grupo, setGrupo] = useState<Grupo>(initialGrupo);
  const { data, isLoading, isError, error } = useGrupo(entityId as string);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof Grupo>(prop: P, value: Grupo[P]) => {
    setGrupo({ ...grupo, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataGrupo: grupo,
        idUpdateData: entityId,
      });
      toast.success("Grupo actualizado. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const clear = () => {
    setValue(0);
    setGrupo(initialGrupo);
  };

  const loadGrupo = useCallback(() => {
    if (data)
      setGrupo({
        _id: data?._id,
        nombre: data?.nombre,
        descripcion: data?.descripcion,
      });
  }, [data]);

  useEffect(() => {
    loadGrupo();
  }, [loadGrupo]);

  const closeModal = () => {
    handleClose();
    clear();
  };

  return (
    <BootstrapDialog
      onClose={closeModal}
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
            onClose={closeModal}
          >
            Nuevo Grupo
          </BootstrapDialogTitle>
          <DialogContent dividers>
            {/* {isErrorListModules && (
            <Alert severity="error">
              {JSON.parse(String(errorListModules?.request.response)).message}
            </Alert>
          )} */}
            <Box sx={{ width: "100%", height: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example"
                >
                  <Tab label="General" {...a11yProps(0)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <Grid container spacing={2}>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      required
                      value={grupo.nombre}
                      id="nombre-required"
                      onChange={(e) => handleChange("nombre", e.target.value)}
                      label="Ingresa nombre del grupo"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      value={grupo.descripcion}
                      id="descripcion-required"
                      onChange={(e) =>
                        handleChange("descripcion", e.target.value)
                      }
                      label="Ingresa descripcion del grupo(opcional)"
                      autoComplete="off"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              disabled={isLoadingMutate}
              onClick={handleOk}
            >
              OK
            </Button>
          </DialogActions>
        </>
      )}
    </BootstrapDialog>
  );
};

export default GrupoEdit;

import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { IModal } from "../../interface/Modal";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { a11yProps } from "../../utils/helpers/functions";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ErrorServer } from "../../interface/Error";
import { Afiliado } from "../../interface/Afiliado";
import { useAfiliado, useMutateAfiliado } from "../hooks/useAfiliados";
import { useGrupos } from "../hooks/useGrupos";
import AfiliadoPagoItem from "./AfiliadoPagoItem";

const initialAfiliado: Afiliado = {
  _id: "",
  grupo: "",
  dni: "",
  nombres: "",
  apellidos: "",
  proyecto: "",
  situacion_afiliado: "",
  puesto_trabajo: "",
  celular: "",
  pagos: [],
};

const AfiliadoEdit = ({ handleClose, open, entityId }: IModal) => {
  const [value, setValue] = useState<number>(0);
  const [afiliado, setAfiliado] = useState<Afiliado>(initialAfiliado);
  const { data, isLoading, isError, error } = useAfiliado(entityId as string);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateAfiliado();
  const [cantPagos, setCantPagos] = useState<number[]>([]);
  const [itemsPagos, setItemsPagos] = useState<any[]>([]);
  const {
    data: grupos,
    isLoading: isLoadingGrupos,
    isError: isErrorGrupos,
  } = useGrupos();
  const [motivo, setMotivo] = useState("");
  const [openEdit, setOpenEdit] = useState(false);

  const clear = () => {
    setValue(0);
    setAfiliado(initialAfiliado);
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const closeModal = () => {
    handleClose();
    clear();
  };

  const handleClickEdit = () => {
    setOpenEdit(true);
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataAfiliado: {
          ...afiliado,
          pagos: itemsPagos,
          motivo: motivo,
        },
        idUpdateData: entityId,
      });
      toast.success("Afiliado actualizado. !");
      closeModal();
    } catch (e: any) {
      const error: ErrorServer = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleAddPago = useCallback(() => {
    const getEndNumber = cantPagos[cantPagos.length - 1] || 0;
    setCantPagos([...cantPagos, Number(getEndNumber) + 1]);
    setItemsPagos([
      ...itemsPagos,
      {
        nro: Number(getEndNumber) + 1,
        destino_dinero: "",
        fecha: new Date(),
        pago: "",
        importe: 0,
      },
    ]);
  }, [cantPagos, itemsPagos]);

  const handleRemovePago = useCallback(
    (item: number) => {
      const findNumber = itemsPagos.filter((a) => a.nro !== item);
      const reformatedNumbers = findNumber.map((_, i) => i + 1);
      const reformatedNumbersComponent = findNumber.map((a, i) => {
        return {
          ...a,
          nro: i + 1,
        };
      });
      setItemsPagos(reformatedNumbersComponent);
      setCantPagos(reformatedNumbers);
    },
    [itemsPagos]
  );

  const handleChange = <P extends keyof Afiliado>(
    prop: P,
    value: Afiliado[P]
  ) => {
    setAfiliado({ ...afiliado, [prop]: value });
  };

  const loadAfiliado = useCallback(() => {
    if (data)
      setAfiliado({
        _id: data?._id,
        grupo: data?.grupo,
        dni: data?.dni,
        nombres: data?.nombres,
        apellidos: data?.apellidos,
        proyecto: data?.proyecto,
        puesto_trabajo: data?.puesto_trabajo,
        situacion_afiliado: data?.situacion_afiliado,
        celular: data?.celular,
        pagos: data?.pagos,
      });
    setItemsPagos((data?.pagos as any[]) || []);
    const cantIngresosLocal = data?.pagos.length;
    setCantPagos([cantIngresosLocal!]);
  }, [data]);

  const handleChangeEdit = (e: any) => {
    setMotivo(e.target.value);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    loadAfiliado();
  }, [loadAfiliado]);

  return (
    <>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Editar {data?.full_name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Esta seguro que desea editar información del afiliado?
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="motivo"
            label="Escribe el motivo de la edición"
            type="text"
            onChange={handleChangeEdit}
            fullWidth
            required
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOk} disabled={isLoadingMutate}>
            Editar de todas formas
          </Button>
          <Button variant="contained" onClick={handleCloseEdit}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="md"
        fullWidth
        myWidth="100%"
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
              AFILIADO {afiliado.nombres + " " + afiliado.apellidos}
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
                    <Tab label="Datos" {...a11yProps(0)} />
                    <Tab label="Agenda" {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <FormControl fullWidth>
                        <Select
                          required
                          labelId="grupo-select-label"
                          id="grupo-select"
                          value={afiliado.grupo as string}
                          displayEmpty
                          onChange={(e) =>
                            handleChange("grupo", e.target.value)
                          }
                        >
                          <MenuItem disabled value="">
                            [Seleccione un grupo]
                          </MenuItem>
                          {isLoadingGrupos ? (
                            <MenuItem>Cargando grupos...</MenuItem>
                          ) : grupos?.length === 0 ? (
                            <MenuItem disabled={true} value="vaciox">
                              <strong style={{ color: "red" }}>
                                No se encontró ningún grupo. Por favor crea uno
                                nuevo.
                              </strong>
                            </MenuItem>
                          ) : (
                            grupos?.map((grupo) => {
                              return (
                                <MenuItem
                                  disabled={grupo.status ? false : true}
                                  key={grupo._id}
                                  value={grupo._id}
                                >
                                  {grupo.nombre}
                                </MenuItem>
                              );
                            })
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.dni}
                        id="dni-required"
                        onChange={(e) => handleChange("dni", e.target.value)}
                        label="Ingrese el nro de DNI"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.nombres}
                        id="nombres-required"
                        onChange={(e) =>
                          handleChange("nombres", e.target.value)
                        }
                        label="Ingrese el nombre completo del afiliado"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={6}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.apellidos}
                        id="apellidos-required"
                        onChange={(e) =>
                          handleChange("apellidos", e.target.value)
                        }
                        label="Ingrese apellido completo del afiliado"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.celular}
                        id="celular-required"
                        onChange={(e) =>
                          handleChange("celular", e.target.value)
                        }
                        label="Ingresa celular del afiliado"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.proyecto}
                        id="proyecto-required"
                        onChange={(e) =>
                          handleChange("proyecto", e.target.value)
                        }
                        label="Ingresa proyecto del afiliado"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.situacion_afiliado}
                        id="situacion-required"
                        onChange={(e) =>
                          handleChange("situacion_afiliado", e.target.value)
                        }
                        label="Ingresa la situación del afiliado"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={afiliado.puesto_trabajo}
                        id="puesto-required"
                        onChange={(e) =>
                          handleChange("puesto_trabajo", e.target.value)
                        }
                        label="Ingresa puesto de trabajo del afiliado(opcional)"
                        autoComplete="off"
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <Button variant="contained" onClick={handleAddPago}>
                        Agregar pagos del afiliado
                      </Button>
                    </Grid>
                    {itemsPagos.map((item, i) => {
                      return (
                        <AfiliadoPagoItem
                          key={i + 1}
                          item={item}
                          handleRemovePago={handleRemovePago}
                          setItemsPagos={setItemsPagos}
                          itemsPagos={itemsPagos}
                        />
                      );
                    })}
                  </Grid>
                </TabPanel>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={closeModal}>
                Cancelar
              </Button>
              <Button variant="contained" onClick={handleClickEdit}>
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </BootstrapDialog>
    </>
  );
};

export default AfiliadoEdit;

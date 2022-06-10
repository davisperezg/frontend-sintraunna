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
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContentText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
} from "@mui/material";
import { IModal } from "../../interface/Modal";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import {
  a11yProps,
  formatDate,
  formatter,
} from "../../utils/helpers/functions";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Ingreso } from "../../interface/Ingreso";
import { useIngreso } from "../hooks/useIngreso";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useMutateIngreso } from "../hooks/useIngreso";
import { toast } from "react-toastify";
import { ErrorServer } from "../../interface/Error";
import { Transition } from "../General/ComponentsIndex";
import CloseIcon from "@mui/icons-material/Close";

const initialIngreso: Ingreso = {
  fecha: new Date(),
  partido_vs: "",
  local_visita: "Local",
  fase_copaPeru: "",
  realizo_actividad: "Si",
  nombre_actividad: "",
  ingreso_total_actividad: 0,
  ingreso_apoyo_tribuna: 0,
  ingreso_cuota_dirigentes: 0,
  otros_ingresos: 0,
  ingreso_taquilla: 0,
};

const IngresoEdit = ({ handleClose, open, entityId }: IModal) => {
  const [value, setValue] = useState<number>(0);
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [ingreso, setIngreso] = useState<Ingreso>(initialIngreso);
  const { data, isLoading, isError, error } = useIngreso(entityId as string);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateIngreso();
  const [openEdit, setOpenEdit] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [openFull, setOpenFull] = useState(false);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handlePrevia = () => {
    setOpenFull(true);
  };

  const handleCloseFull = () => {
    setOpenFull(false);
  };

  const closeModal = () => {
    handleClose();
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataIngreso: { ...ingreso, fecha: valueDate, motivo_editacion: motivo },
        idUpdateData: entityId,
      });
      toast.success("Liquidación actualizada. !");
      closeModal();
    } catch (e: any) {
      const error: ErrorServer = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValueDate(newValue);
  };

  const handleChange = <P extends keyof Ingreso>(
    prop: P,
    value: Ingreso[P]
  ) => {
    setIngreso({ ...ingreso, [prop]: value });
  };

  const loadIngreso = useCallback(() => {
    if (data)
      setIngreso({
        _id: data?._id,
        fecha: data?.fecha,
        partido_vs: data?.partido_vs,
        fase_copaPeru: data?.fase_copaPeru,
        local_visita: data?.local_visita,
        realizo_actividad: data?.realizo_actividad,
        nombre_actividad: data?.nombre_actividad,
        ingreso_total_actividad: data?.ingreso_total_actividad,
        ingreso_apoyo_tribuna: data?.ingreso_apoyo_tribuna,
        ingreso_cuota_dirigentes: data?.ingreso_cuota_dirigentes,
        otros_ingresos: data?.otros_ingresos,
        ingreso_taquilla: data?.ingreso_taquilla,
      });

    setValueDate(data?.fecha as Date | null);
  }, [data]);

  const handleChangeEdit = (e: any) => {
    setMotivo(e.target.value);
  };

  const handleClickEdit = () => {
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    loadIngreso();
  }, [loadIngreso]);

  return (
    <>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Editar INGRESO?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Esta seguro que desea editar el ingreso?
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

      <Dialog
        fullScreen
        open={openFull}
        onClose={handleCloseFull}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFull}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              VISTA PREVIA DE LIQUIDACION DE PLANILLA - INGRESO(EDITANDO)
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClickEdit}>
              Guardar
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Fecha de egreso:</strong>&nbsp;&nbsp;
            <label>{formatDate(new Date(String(valueDate)), false)}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Fase de copa Perú:</strong>&nbsp;&nbsp;
            <label>{ingreso?.fase_copaPeru}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Partido VS:</strong>&nbsp;&nbsp;
            <label>{ingreso?.partido_vs}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>El encuentro se jugó de:</strong>&nbsp;&nbsp;
            <label>{ingreso?.local_visita}</label>
          </div>
          <br />
          <br />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Se realizó actividad ?:</strong>&nbsp;&nbsp;
            <label>{ingreso?.realizo_actividad}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Nombre de actividad:</strong>&nbsp;&nbsp;
            <label>{ingreso?.nombre_actividad}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Ingreso total de actividad:</strong>&nbsp;&nbsp;
            <label>
              S/{formatter.format(ingreso?.ingreso_total_actividad)}
            </label>
          </div>
          <br />
          <br />
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Ingreso de apoyo tribuna:</strong>&nbsp;&nbsp;
            <label>S/{formatter.format(ingreso?.ingreso_apoyo_tribuna)}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Ingreso cuota de dirigentes:</strong>&nbsp;&nbsp;
            <label>
              S/{formatter.format(ingreso?.ingreso_cuota_dirigentes)}
            </label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Otros ingresos:</strong>&nbsp;&nbsp;
            <label>S/{formatter.format(ingreso?.otros_ingresos)}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Ingreso de taquilla:</strong>&nbsp;&nbsp;
            <label>S/{formatter.format(ingreso?.ingreso_taquilla)}</label>
          </div>
          <br />
          <br />
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <strong>Total:</strong>&nbsp;&nbsp;
            <label style={{ color: "green" }}>
              S/
              {formatter.format(
                ingreso.ingreso_total_actividad +
                  ingreso.ingreso_apoyo_tribuna +
                  ingreso.ingreso_cuota_dirigentes +
                  ingreso.otros_ingresos +
                  ingreso.ingreso_taquilla
              )}
            </label>
          </div>
        </div>
      </Dialog>

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
              LIQUIDACIÓN({ingreso.local_visita}) REAL FUJIMORI VS{" "}
              {ingreso.partido_vs}
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
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <Grid container spacing={2}>
                    <Grid item md={12}>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Fecha de ingreso"
                          inputFormat="dd/MM/yyyy"
                          value={valueDate}
                          onChange={handleChangeDate}
                          renderInput={(params: any) => (
                            <TextField {...params} style={{ width: "100%" }} />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={ingreso.partido_vs}
                        id="partidovs-required"
                        onChange={(e) =>
                          handleChange("partido_vs", e.target.value)
                        }
                        label="¿El partido se jugó con?"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        value={ingreso.fase_copaPeru}
                        id="fasecopa-required"
                        onChange={(e) =>
                          handleChange("fase_copaPeru", e.target.value)
                        }
                        label="Fase de copa Perú"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={6}>
                      <FormControl>
                        <FormLabel id="lv-row-radio-buttons-group-label">
                          Modo de juego
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="lv-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={ingreso.local_visita}
                          onChange={(e) =>
                            handleChange("local_visita", e.target.value)
                          }
                        >
                          <FormControlLabel
                            value="LOCAL"
                            control={<Radio />}
                            label="Local"
                          />
                          <FormControlLabel
                            value="VISITANTE"
                            control={<Radio />}
                            label="Visitante"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item md={6}>
                      <FormControl>
                        <FormLabel id="actividad-row-radio-buttons-group-label">
                          Se realizó actividad ?
                        </FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="actividad-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          value={ingreso.realizo_actividad}
                          onChange={(e) => {
                            if (e.target.value === "No") {
                              setIngreso({
                                ...ingreso,
                                realizo_actividad: "No",
                                ingreso_total_actividad: 0,
                                nombre_actividad: "NINGUNO",
                              });
                            } else {
                              handleChange("realizo_actividad", e.target.value);
                            }
                          }}
                        >
                          <FormControlLabel
                            value="Si"
                            control={<Radio />}
                            label="Si"
                          />
                          <FormControlLabel
                            value="No"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    {ingreso.realizo_actividad === "Si" && (
                      <>
                        <Grid item md={12}>
                          <TextField
                            fullWidth
                            required
                            id="nombre-actividad-required"
                            label="Nombre de actividad"
                            autoComplete="off"
                            value={ingreso.nombre_actividad}
                            onChange={(e) =>
                              handleChange("nombre_actividad", e.target.value)
                            }
                          />
                        </Grid>
                        <Grid item md={12}>
                          <TextField
                            fullWidth
                            required
                            id="total-actividad-required"
                            label="Ingreso total de actividad"
                            value={ingreso.ingreso_total_actividad}
                            inputProps={{
                              step: "0.01",
                              min: "0",
                            }}
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  S/
                                </InputAdornment>
                              ),
                            }}
                            onChange={(e) => {
                              const value = e.target.value;
                              const arr = value.split(".");
                              const decimal = arr.length >= 2 && arr[1];
                              if (
                                typeof decimal === "string" &&
                                decimal.length <= 2
                              ) {
                                handleChange(
                                  "ingreso_total_actividad",
                                  Number(e.target.value)
                                );
                              }
                              if (
                                typeof decimal === "boolean" &&
                                decimal === false
                              ) {
                                handleChange(
                                  "ingreso_total_actividad",
                                  Number(e.target.value)
                                );
                              }
                            }}
                            autoComplete="off"
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        id="ingreso-apoyo-required"
                        label="Ingreso de apoyo de la tribuna"
                        value={ingreso.ingreso_apoyo_tribuna}
                        inputProps={{
                          step: "0.01",
                          min: "0",
                        }}
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">S/</InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const arr = value.split(".");
                          const decimal = arr.length >= 2 && arr[1];
                          if (
                            typeof decimal === "string" &&
                            decimal.length <= 2
                          ) {
                            handleChange(
                              "ingreso_apoyo_tribuna",
                              Number(e.target.value)
                            );
                          }
                          if (
                            typeof decimal === "boolean" &&
                            decimal === false
                          ) {
                            handleChange(
                              "ingreso_apoyo_tribuna",
                              Number(e.target.value)
                            );
                          }
                        }}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        id="ingreso-dirigentes-required"
                        label="Ingreso cuota de dirigentes"
                        value={ingreso.ingreso_cuota_dirigentes}
                        inputProps={{
                          step: "0.01",
                          min: "0",
                        }}
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">S/</InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const arr = value.split(".");
                          const decimal = arr.length >= 2 && arr[1];
                          if (
                            typeof decimal === "string" &&
                            decimal.length <= 2
                          ) {
                            handleChange(
                              "ingreso_cuota_dirigentes",
                              Number(e.target.value)
                            );
                          }
                          if (
                            typeof decimal === "boolean" &&
                            decimal === false
                          ) {
                            handleChange(
                              "ingreso_cuota_dirigentes",
                              Number(e.target.value)
                            );
                          }
                        }}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        id="otros-required"
                        label="Otros ingresos"
                        value={ingreso.otros_ingresos}
                        inputProps={{
                          step: "0.01",
                          min: "0",
                        }}
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">S/</InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          const value = e.target.value;
                          const arr = value.split(".");
                          const decimal = arr.length >= 2 && arr[1];
                          if (
                            typeof decimal === "string" &&
                            decimal.length <= 2
                          ) {
                            handleChange(
                              "otros_ingresos",
                              Number(e.target.value)
                            );
                          }
                          if (
                            typeof decimal === "boolean" &&
                            decimal === false
                          ) {
                            handleChange(
                              "otros_ingresos",
                              Number(e.target.value)
                            );
                          }
                        }}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        required
                        id="ingreso-taquilla-required"
                        label="Ingreso de taquilla"
                        value={ingreso.ingreso_taquilla}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">S/</InputAdornment>
                          ),
                        }}
                        inputProps={{
                          step: "0.01",
                          min: "0",
                        }}
                        type="number"
                        onChange={(e) => {
                          const value = e.target.value;
                          const arr = value.split(".");
                          const decimal = arr.length >= 2 && arr[1];
                          if (
                            typeof decimal === "string" &&
                            decimal.length <= 2
                          ) {
                            handleChange(
                              "ingreso_taquilla",
                              Number(e.target.value)
                            );
                          }
                          if (
                            typeof decimal === "boolean" &&
                            decimal === false
                          ) {
                            handleChange(
                              "ingreso_taquilla",
                              Number(e.target.value)
                            );
                          }
                        }}
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1>Total:</h1>
                        <h3 style={{ color: "green" }}>
                          S/
                          {formatter.format(
                            ingreso.ingreso_total_actividad +
                              ingreso.ingreso_apoyo_tribuna +
                              ingreso.ingreso_cuota_dirigentes +
                              ingreso.otros_ingresos +
                              ingreso.ingreso_taquilla
                          )}
                        </h3>
                      </div>
                    </Grid>
                  </Grid>
                </TabPanel>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button variant="outlined" onClick={closeModal}>
                Cancelar
              </Button>
              <Button variant="contained" autoFocus onClick={handlePrevia}>
                VISTA PREVIA
              </Button>
            </DialogActions>
          </>
        )}
      </BootstrapDialog>
    </>
  );
};

export default IngresoEdit;

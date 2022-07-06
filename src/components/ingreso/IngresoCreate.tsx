import { IModal } from "../../interface/Modal";
import {
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  Tab,
  Tabs,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import {
  a11yProps,
  formatDate,
  formatter,
} from "../../utils/helpers/functions";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { SyntheticEvent, useCallback, useMemo, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Ingreso } from "../../interface/Ingreso";
import { useMutateIngreso } from "../hooks/useIngreso";
import { toast } from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import { Transition } from "../General/ComponentsIndex";
import IngresoItem from "./IngresoItemGasto";
import { useAfiliados } from "../hooks/useAfiliados";
import axios from "axios";
import { BASE_API } from "../../consts/api";
import { Table } from "../../views/IndexStyle";

const initialIngreso: Ingreso = {
  fecha: new Date(),
  afiliado: "",
  detalle_ingreso: "",
  ingresos_afiliado: [],
};

const IngresoCreate = ({ handleClose, open }: IModal) => {
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateIngreso();
  const [value, setValue] = useState<number>(0);
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [ingreso, setIngreso] = useState<Ingreso>(initialIngreso);
  const [openFull, setOpenFull] = useState(false);
  const [ingresos, setIngresos] = useState<number[]>([]);
  const [enitityAfiliado, setEntityAfiliado] = useState<{
    proyecto: string;
    full_name: string;
  }>({
    proyecto: "",
    full_name: "",
  });
  const [itemsIngresos, setItemsIngresos] = useState<any[]>([]);
  const {
    data: afiliados,
    isLoading: isLoadingAfiliados,
    isError: isErrorAfiliados,
  } = useAfiliados();

  const clear = () => {
    setValue(0);
    setValueDate(new Date());
    setIngreso(initialIngreso);
    setItemsIngresos([]);
    setIngresos([]);
    setEntityAfiliado({
      proyecto: "",
      full_name: "",
    });
  };

  const handlePrevia = () => {
    setOpenFull(true);
  };

  const handleCloseFull = () => {
    setOpenFull(false);
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValueDate(newValue);
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = async <P extends keyof Ingreso>(
    prop: P,
    value: Ingreso[P]
  ) => {
    if (prop === "afiliado") {
      const getAfiliado = await axios.get(
        `${BASE_API}/api/v1/afiliados/find/${value}`
      );
      setEntityAfiliado({
        proyecto: getAfiliado.data.proyecto,
        full_name: getAfiliado.data.nombres + " " + getAfiliado.data.apellidos,
      });
    }
    setIngreso({ ...ingreso, [prop]: value });
  };

  const handleAddIngresos = useCallback(() => {
    const getEndNumber = ingresos[ingresos.length - 1] || 0;
    setIngresos([...ingresos, Number(getEndNumber) + 1]);
    setItemsIngresos([
      ...itemsIngresos,
      {
        nro: Number(getEndNumber) + 1,
        proyecto: enitityAfiliado.proyecto,
        concepto: "",
        importe: 0,
      },
    ]);
  }, [ingresos, itemsIngresos, enitityAfiliado.proyecto]);

  const handleRemoveIngreso = (item: number) => {
    const findNumber = itemsIngresos.filter((a) => a.nro !== item);
    const reformatedNumbers = findNumber.map((_, i) => i + 1);
    const reformatedNumbersComponent = findNumber.map((a, i) => {
      return {
        ...a,
        nro: i + 1,
      };
    });
    setItemsIngresos(reformatedNumbersComponent);
    setIngresos(reformatedNumbers);
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataIngreso: {
          ...ingreso,
          fecha: valueDate,
          ingresos_afiliado: itemsIngresos,
        },
      });
      toast.success("Ingreso del afiliado creado. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const closeModal = () => {
    handleClose();
    clear();
    handleCloseFull();
  };

  const memoTotal = useMemo(() => {
    const importeTotal = itemsIngresos.reduce((a: number, b) => {
      return a + Number(b.importe);
    }, 0);

    return importeTotal;
  }, [itemsIngresos]);

  return (
    <>
      {" "}
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
              AFILIADO {enitityAfiliado.full_name} - INGRESO
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={handleOk}
              disabled={isLoadingMutate}
            >
              Guardar
            </Button>
          </Toolbar>
        </AppBar>
        <div style={{ display: "flex", flexDirection: "column", padding: 24 }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Fecha de ingreso:</strong>&nbsp;&nbsp;
            <label>{formatDate(new Date(String(valueDate)), false)}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Afiliado:</strong>&nbsp;&nbsp;
            <label>{enitityAfiliado?.full_name}</label>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <strong>Detalle del ingreso:</strong>&nbsp;&nbsp;
            <label>{ingreso?.detalle_ingreso}</label>
          </div>
          <br />
          <br />
          <Table style={{ padding: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Nro</th>
                  <th>Proyecto</th>
                  <th>Concepto</th>
                  <th>Importe</th>
                </tr>
              </thead>
              <tbody>
                {itemsIngresos.map((item) => (
                  <tr key={item.nro}>
                    <td>{item.nro}</td>
                    <td>{item.proyecto}</td>
                    <td>{item.concepto}</td>
                    <td>S/{formatter.format(item.importe)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot style={{ backgroundColor: "green", color: "#fff" }}>
                <tr>
                  <td colSpan={3}>Total</td>
                  <td>
                    S/
                    {formatter.format(memoTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </Table>
        </div>
      </Dialog>
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          Nuevo Ingreso
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
                  <FormControl fullWidth>
                    <Select
                      required
                      labelId="afiliado-select-label"
                      id="afiliado-select"
                      value={ingreso.afiliado as string}
                      displayEmpty
                      onChange={(e) => handleChange("afiliado", e.target.value)}
                    >
                      <MenuItem disabled value="">
                        [Seleccione un afiliado]
                      </MenuItem>
                      {isLoadingAfiliados ? (
                        <MenuItem>Cargando afiliados...</MenuItem>
                      ) : afiliados?.length === 0 ? (
                        <MenuItem disabled={true} value="vaciox">
                          <strong style={{ color: "red" }}>
                            No se encontró ningún afiliado. Por favor crea uno
                            nuevo.
                          </strong>
                        </MenuItem>
                      ) : (
                        afiliados?.map((afiliado) => {
                          return (
                            <MenuItem
                              disabled={afiliado.status ? false : true}
                              key={afiliado._id}
                              value={afiliado._id}
                            >
                              {afiliado.full_name}
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
                    value={ingreso.detalle_ingreso}
                    id="detalle_ingreso"
                    onChange={(e) =>
                      handleChange("detalle_ingreso", e.target.value)
                    }
                    variant="outlined"
                    label="Ingresa detalle del ingreso(opcional)"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item md={12}>
                  <Button
                    variant="contained"
                    disabled={enitityAfiliado.proyecto ? false : true}
                    onClick={handleAddIngresos}
                  >
                    Agregar Ingresos del afiliado
                  </Button>
                </Grid>
                {itemsIngresos.map((item, i) => {
                  return (
                    <IngresoItem
                      key={i + 1}
                      item={item}
                      handleRemoveGasto={handleRemoveIngreso}
                      setItemsIngresos={setItemsIngresos}
                      itemsIngresos={itemsIngresos}
                    />
                  );
                })}
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
                      {formatter.format(memoTotal)}
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
      </BootstrapDialog>
    </>
  );
};

export default IngresoCreate;

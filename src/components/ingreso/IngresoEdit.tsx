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
  Dialog,
  DialogTitle,
  DialogContentText,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { IModal } from "../../interface/Modal";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import {
  a11yProps,
  formatDate,
  formatter,
} from "../../utils/helpers/functions";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import { Table } from "../../views/IndexStyle";
import IngresoItem from "./IngresoItemGasto";
import { useAfiliados } from "../hooks/useAfiliados";
import { Afiliado } from "../../interface/Afiliado";
import axios from "axios";
import { BASE_API } from "../../consts/api";

const initialIngreso: Ingreso = {
  fecha: new Date(),
  afiliado: "",
  detalle_ingreso: "",
  ingresos_afiliado: [],
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
  const [itemsIngresos, setItemsIngresos] = useState<any[]>([]);
  const [cantIngresos, setCantIngresos] = useState<number[]>([]);
  const {
    data: afiliados,
    isLoading: isLoadingAfiliados,
    isError: isErrorAfiliados,
  } = useAfiliados();
  const [enitityAfiliado, setEntityAfiliado] = useState<{
    proyecto: string;
    full_name: string;
  }>({
    proyecto: "",
    full_name: "",
  });

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
      toast.success("Ingreso del afiliado actualizado. !");
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

  const loadIngreso = useCallback(async () => {
    if (data)
      setIngreso({
        _id: data?._id,
        fecha: data?.fecha,
        afiliado: (data?.afiliado as Afiliado)._id,
        detalle_ingreso: data?.detalle_ingreso,
        ingresos_afiliado: data?.ingresos_afiliado,
      });
    const getAfiliado = await axios.get(
      `${BASE_API}/api/v1/afiliados/find/${(data?.afiliado as Afiliado)._id}`
    );
    setEntityAfiliado({
      proyecto: getAfiliado.data.proyecto,
      full_name: getAfiliado.data.nombres + " " + getAfiliado.data.apellidos,
    });
    setItemsIngresos((data?.ingresos_afiliado as any[]) || []);
    setValueDate(data?.fecha as Date | null);
    const cantIngresosLocal = data?.ingresos_afiliado.length;
    setCantIngresos([cantIngresosLocal!]);
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

  const handleAddIngresos = useCallback(() => {
    const getEndNumber = cantIngresos[cantIngresos.length - 1] || 0;
    setCantIngresos([...cantIngresos, Number(getEndNumber) + 1]);
    setItemsIngresos([
      ...itemsIngresos,
      {
        nro: Number(getEndNumber) + 1,
        proyecto: enitityAfiliado.proyecto,
        concepto: "",
        importe: 0,
      },
    ]);
  }, [cantIngresos, itemsIngresos, enitityAfiliado.proyecto]);

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
    setCantIngresos(reformatedNumbers);
  };

  const memoTotal = useMemo(() => {
    const importeTotal = itemsIngresos.reduce((a: number, b) => {
      return a + Number(b.importe);
    }, 0);

    return importeTotal;
  }, [itemsIngresos]);

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
              INGRESO DEL AFILIADO {enitityAfiliado.full_name} - EDITANDO
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClickEdit}>
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
            <label>{enitityAfiliado.full_name}</label>
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
              INGRESO DEL AFILIADO {enitityAfiliado.full_name}
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
                      <FormControl fullWidth>
                        <Select
                          required
                          labelId="afiliado-select-label"
                          id="afiliado-select"
                          value={ingreso.afiliado as string}
                          displayEmpty
                          onChange={(e) =>
                            handleChange("afiliado", e.target.value)
                          }
                        >
                          <MenuItem disabled value="">
                            [Seleccione un afiliado]
                          </MenuItem>
                          {isLoadingAfiliados ? (
                            <MenuItem>Cargando afiliados...</MenuItem>
                          ) : afiliados?.length === 0 ? (
                            <MenuItem disabled={true} value="vaciox">
                              <strong style={{ color: "red" }}>
                                No se encontró ningún afiliado. Por favor crea
                                uno nuevo.
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
                        label="Ingresa detalle del ingreso(opcional)"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={6}>
                      <Button
                        variant="contained"
                        //disabled={ingreso. ? false : true}
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
          </>
        )}
      </BootstrapDialog>
    </>
  );
};

export default IngresoEdit;

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
  DialogTitle,
  DialogContentText,
} from "@mui/material";
import { IModal } from "../../interface/Modal";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { a11yProps, formatter } from "../../utils/helpers/functions";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { useEgreso, useMutateEgreso } from "../hooks/useEgreso";
import { Egreso } from "../../interface/Egreso";
import { toast } from "react-toastify";
import { ErrorServer } from "../../interface/Error";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import EgresoItemGasto from "./EgresoItemGasto";

const initialEgreso: Egreso = {
  fecha: new Date(),
  nombre_destinatario: "",
  detalle_egreso: "Local",
  gastos: [],
};

const EgresoEdit = ({ handleClose, open, entityId }: IModal) => {
  const [value, setValue] = useState<number>(0);
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [egreso, setEgreso] = useState<Egreso>(initialEgreso);
  const { data, isLoading, isError, error } = useEgreso(entityId as string);
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateEgreso();
  const [itemsGasto, setItemsGasto] = useState<any[]>([]);
  const [gasto, setGasto] = useState<number[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [motivo, setMotivo] = useState("");

  const handleClickEdit = () => {
    setOpenEdit(true);
    //closeModal();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const clear = () => {
    setValue(0);
    setValueDate(new Date());
    setEgreso(initialEgreso);
    setGasto([]);
    setItemsGasto([]);
    setMotivo("");
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const closeModal = () => {
    handleClose();
    clear();
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataEgreso: {
          ...egreso,
          fecha: valueDate,
          gastos: itemsGasto,
          motivo: motivo,
        },
        idUpdateData: entityId,
      });
      toast.success("Egreso actualizado. !");
      closeModal();
    } catch (e: any) {
      const error: ErrorServer = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValueDate(newValue);
  };

  const handleChange = <P extends keyof Egreso>(prop: P, value: Egreso[P]) => {
    setEgreso({ ...egreso, [prop]: value });
  };

  const loadEgreso = useCallback(async () => {
    if (data)
      setEgreso({
        _id: data?._id,
        fecha: data?.fecha,
        nombre_destinatario: data?.nombre_destinatario,
        detalle_egreso: data?.detalle_egreso,
        gastos: data?.gastos,
      });

    setValueDate(data?.fecha as Date | null);
    setItemsGasto((data?.gastos as any[]) || []);
    const cantGastos = data?.gastos.length;
    setGasto([cantGastos!]);
  }, [data]);

  const handleAddGasto = useCallback(() => {
    const getEndNumber = gasto[gasto.length - 1] || 0;
    setGasto([...gasto, Number(getEndNumber) + 1]);
    setItemsGasto([
      ...itemsGasto,
      {
        nro: Number(getEndNumber) + 1,
        proviene_dinero: "",
        gasto: "",
        monto: "",
      },
    ]);
  }, [gasto, itemsGasto]);

  const handleRemoveGasto = (item: number) => {
    const findNumber = itemsGasto.filter((a) => a.nro !== item);
    const reformatedNumbers = findNumber.map((_, i) => i + 1);
    const reformatedNumbersComponent = findNumber.map((a, i) => {
      return {
        ...a,
        nro: i + 1,
      };
    });
    setItemsGasto(reformatedNumbersComponent);
    setGasto(reformatedNumbers);
  };

  const handleChangeEdit = (e: any) => {
    setMotivo(e.target.value);
  };

  useEffect(() => {
    loadEgreso();
  }, [loadEgreso]);

  return (
    <>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Editar"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Esta seguro que desea editar el egreso?
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
      >
        {" "}
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
              EGRESO
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
                      <TextField
                        fullWidth
                        required
                        value={egreso.nombre_destinatario}
                        id="nombre_destinatario"
                        onChange={(e) =>
                          handleChange("nombre_destinatario", e.target.value)
                        }
                        label="Nombre del destinatario"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item md={12}>
                      <TextField
                        fullWidth
                        value={egreso.detalle_egreso}
                        id="detalle_egreso"
                        onChange={(e) =>
                          handleChange("detalle_egreso", e.target.value)
                        }
                        label="Detalle de egreso(opcional)"
                        autoComplete="off"
                      />
                    </Grid>

                    <Grid item md={12}>
                      <Button variant="contained" onClick={handleAddGasto}>
                        Agregar gasto
                      </Button>
                    </Grid>
                    {itemsGasto.map((item, i) => {
                      return (
                        <EgresoItemGasto
                          key={i + 1}
                          item={item}
                          handleRemoveGasto={handleRemoveGasto}
                          setItemsGasto={setItemsGasto}
                          itemsGasto={itemsGasto}
                        />
                      );
                    }) || []}
                    <Grid item md={12}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h1>Total:</h1>
                        <h3 style={{ color: "red" }}>
                          S/
                          {formatter.format(
                            itemsGasto.reduce((a, b) => {
                              return Number(a) + Number(b.monto);
                            }, 0)
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
              <Button variant="contained" autoFocus onClick={handleClickEdit}>
                OK
              </Button>
            </DialogActions>
          </>
        )}
      </BootstrapDialog>
    </>
  );
};

export default EgresoEdit;

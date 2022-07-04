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
} from "@mui/material";
import { a11yProps, formatter } from "../../utils/helpers/functions";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { SyntheticEvent, useCallback, useState } from "react";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Egreso } from "../../interface/Egreso";
import EgresoItemGasto from "./EgresoItemGasto";
import { useMutateEgreso } from "../hooks/useEgreso";
import { toast } from "react-toastify";

const initialEgreso: Egreso = {
  fecha: new Date(),
  nombre_destinatario: "",
  detalle_egreso: "",
  gastos: [],
};

const EgresoCreate = ({ handleClose, open }: IModal) => {
  const { mutateAsync, isLoading: isLoadingMutate } = useMutateEgreso();
  const [value, setValue] = useState<number>(0);
  const [valueDate, setValueDate] = useState<Date | null>(new Date());
  const [egreso, setEgreso] = useState<Egreso>(initialEgreso);
  const [gasto, setGasto] = useState<number[]>([]);
  const [itemsGasto, setItemsGasto] = useState<any[]>([]);

  const clear = () => {
    setValue(0);
    setValueDate(new Date());
    setEgreso(initialEgreso);
    setGasto([]);
    setItemsGasto([]);
  };

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValueDate(newValue);
  };

  const handleChange = async <P extends keyof Egreso>(
    prop: P,
    value: Egreso[P]
  ) => {
    setEgreso({ ...egreso, [prop]: value });
  };

  const handleAddGasto = useCallback(() => {
    const getEndNumber = gasto[gasto.length - 1] || 0;
    setGasto([...gasto, Number(getEndNumber) + 1]);
    setItemsGasto([
      ...itemsGasto,
      {
        nro: Number(getEndNumber) + 1,
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

  // const handleChange = <P extends keyof Role>(prop: P, value: Role[P]) => {
  //   setRole({ ...role, [prop]: value });
  // };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataEgreso: { ...egreso, gastos: itemsGasto, fecha: valueDate },
      });
      toast.success("Egreso creado. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const closeModal = () => {
    handleClose();
    clear();
  };

  return (
    <>
      <BootstrapDialog
        onClose={closeModal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={closeModal}>
          Nuevo Egreso
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
                    label="Nombre del destinario"
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
          <Button
            variant="contained"
            disabled={isLoadingMutate}
            onClick={handleOk}
          >
            OK
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
};

export default EgresoCreate;

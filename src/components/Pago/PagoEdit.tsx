import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Pago } from "../../interface/Pago";
import { IModal } from "../../interface/Modal";
import { a11yProps } from "../../utils/helpers/functions";
import { BootstrapDialog, BootstrapDialogTitle } from "../modal";
import TabPanel from "../Tab/Index";
import { useMutatePago, usePago } from "../hooks/usePagos";

const initialPago: Pago = {
  _id: "",
  concepto: "",
  importe: 0,
};

const PagoEdit = ({ handleClose, open, entityId }: IModal) => {
  const { mutateAsync, isLoading: isLoadingMutate } = useMutatePago();
  const [value, setValue] = useState<number>(0);
  const [pago, setPago] = useState<Pago>(initialPago);
  const { data, isLoading, isError, error } = usePago(entityId as string);

  const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChange = <P extends keyof Pago>(prop: P, value: Pago[P]) => {
    setPago({ ...pago, [prop]: value });
  };

  const handleOk = async () => {
    try {
      await mutateAsync({
        dataPago: pago,
        idUpdateData: entityId,
      });
      toast.success("Pago actualizado. !");
      closeModal();
    } catch (e: any) {
      const error: Error = JSON.parse(e.request.response);
      toast.error(error.message);
    }
  };

  const clear = () => {
    setValue(0);
    setPago(initialPago);
  };

  const loadPago = useCallback(() => {
    if (data)
      setPago({
        _id: data?._id,
        concepto: data?.concepto,
        importe: data?.importe,
      });
  }, [data]);

  useEffect(() => {
    loadPago();
  }, [loadPago]);

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
            Pago {data?.concepto}
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
                      value={pago.concepto}
                      id="nombre-required"
                      onChange={(e) => handleChange("concepto", e.target.value)}
                      label="Ingresa nombre del grupo"
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item md={12}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      inputProps={{
                        step: "0.01",
                        min: "0",
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">S/</InputAdornment>
                        ),
                      }}
                      value={pago.importe}
                      onChange={(e) => {
                        const value = e.target.value;
                        const arr = value.split(".");
                        const decimal = arr.length >= 2 && arr[1];
                        if (Number(value) < 0) return;
                        if ((decimal as string).length > 2) return;
                        handleChange("importe", Number(e.target.value));
                      }}
                      label="Importe"
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

export default PagoEdit;

import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_API } from "../../consts/api";
import { usePagos } from "../hooks/usePagos";

interface Props {
  handleRemovePago: (item: number) => void;
  item: any;
  setItemsPagos: any;
  itemsPagos: any;
}

const AfiliadoPagoItem = ({
  item,
  handleRemovePago,
  setItemsPagos,
  itemsPagos,
}: Props) => {
  const [itemP, setItemP] = useState({
    nro: "",
    fecha: new Date(),
    pago: "",
    importe: 0,
  });

  const {
    data: pagos,
    isLoading: isLoadingPagos,
    isError: isErrorPagos,
  } = usePagos();

  useEffect(() => {
    if (item) {
      setItemP({
        nro: item.nro,
        fecha: item.fecha,
        pago: item.pago,
        importe: item.importe,
      });
    }
  }, [item]);

  return (
    <Grid spacing={1} container style={{ paddingLeft: 16, paddingTop: 16 }}>
      <Grid item md={3}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Fecha del pago"
            inputFormat="dd/MM/yyyy"
            value={itemP.fecha}
            onChange={(e) => {
              const ele = itemsPagos.map((res: any) => {
                return {
                  ...res,
                  fecha: res.nro === item.nro ? e : res.fecha,
                };
              });
              setItemsPagos(ele);
              setItemP({ ...itemP, fecha: e as Date });
            }}
            renderInput={(params: any) => (
              <TextField {...params} style={{ width: "100%" }} />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={4}>
        <FormControl fullWidth>
          <Select
            required
            labelId="afiliado-select-label"
            id="afiliado-select"
            value={itemP.pago as string}
            displayEmpty
            onChange={async (e) => {
              const ele = await Promise.all(
                itemsPagos.map(async (res: any) => {
                  const resa = await axios.get(
                    `${BASE_API}/api/v1/pagos/find/${e.target.value}`
                  );
                  return {
                    ...res,
                    pago: res.nro === item.nro ? e.target.value : res.pago,
                    importe:
                      res.nro === item.nro ? resa.data.importe : res.importe,
                  };
                })
              );
              setItemsPagos(ele);
              setItemP({
                ...itemP,
                pago: e.target.value,
              });
            }}
          >
            <MenuItem disabled value="">
              [Seleccione un pago]
            </MenuItem>
            {isLoadingPagos ? (
              <MenuItem>Cargando afiliados...</MenuItem>
            ) : pagos?.length === 0 ? (
              <MenuItem disabled={true}>
                <strong style={{ color: "red" }}>
                  No se encontró ningún pago. Por favor crea uno nuevo.
                </strong>
              </MenuItem>
            ) : (
              pagos?.map((pago) => {
                return (
                  <MenuItem
                    disabled={pago.status ? false : true}
                    key={pago._id}
                    value={pago._id}
                  >
                    {pago.concepto}
                  </MenuItem>
                );
              })
            )}
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={3}>
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
          value={itemP.importe}
          onChange={(e) => {
            const value = e.target.value;
            const arr = value.split(".");
            const decimal = arr.length >= 2 && arr[1];
            if (Number(value) < 0) return;
            if ((decimal as string).length > 2) return;

            const ele = itemsPagos.map((res: any) => {
              return {
                ...res,
                importe:
                  res.nro === item.nro ? Number(e.target.value) : res.importe,
              };
            });
            setItemsPagos(ele);
            setItemP({ ...itemP, importe: Number(e.target.value) });
          }}
          label={`Importe ${itemP.nro}`}
        />
      </Grid>
      <Grid item md={2} style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="error"
          style={{ width: "100%" }}
          onClick={() => handleRemovePago(item.nro)}
        >
          X
        </Button>
      </Grid>
    </Grid>
  );
};

export default AfiliadoPagoItem;

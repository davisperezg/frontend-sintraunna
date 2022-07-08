import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  handleRemoveGasto: (item: number) => void;
  item: any;
  setItemsGasto: any;
  itemsGasto: any;
}

const EgresoItemGasto = ({
  item,
  handleRemoveGasto,
  setItemsGasto,
  itemsGasto,
}: Props) => {
  const [gasto, setGasto] = useState({
    nro: "",
    proviene_dinero: "",
    gasto: "",
    monto: 0,
  });

  useEffect(() => {
    if (item) {
      setGasto({
        nro: item.nro,
        proviene_dinero: item.proviene_dinero,
        gasto: item.gasto,
        monto: item.monto,
      });
    }
  }, [item]);

  return (
    <Grid spacing={3} container style={{ paddingLeft: 16, paddingTop: 16 }}>
      <Grid item md={3}>
        <FormControl fullWidth>
          <InputLabel id="proviene_dinero-select-label">
            Dinero proviene de
          </InputLabel>
          <Select
            required
            labelId="proviene_dinero-select-label"
            id="proviene_dinero-select"
            value={gasto.proviene_dinero as string}
            label="Dinero proviene de"
            onChange={(e) => {
              const ele = itemsGasto.map((res: any) => {
                return {
                  ...res,
                  proviene_dinero:
                    res.nro === item.nro ? e.target.value : res.proviene_dinero,
                };
              });
              setItemsGasto(ele);
              setGasto({ ...gasto, proviene_dinero: e.target.value });
            }}
          >
            <MenuItem value="OLGER PEREZ">OLGER PEREZ</MenuItem>
            <MenuItem value="ABILIO CORONADO">ABILIO CORONADO</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={3}>
        <TextField
          fullWidth
          required
          value={gasto.gasto}
          onChange={(e) => {
            const ele = itemsGasto.map((res: any) => {
              return {
                ...res,
                gasto: res.nro === item.nro ? e.target.value : res.gasto,
              };
            });
            setItemsGasto(ele);
            setGasto({ ...gasto, gasto: e.target.value });
          }}
          label={`Gasto ${gasto.nro}`}
        />
      </Grid>
      <Grid item md={4}>
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
          value={gasto.monto}
          onChange={(e) => {
            const value = e.target.value;
            const arr = value.split(".");
            const decimal = arr.length >= 2 && arr[1];
            if (Number(value) < 0) return;
            if ((decimal as string).length > 2) return;
            const ele = itemsGasto.map((res: any) => {
              return {
                ...res,
                monto:
                  res.nro === item.nro ? Number(e.target.value) : res.monto,
              };
            });
            setItemsGasto(ele);
            setGasto({ ...gasto, monto: Number(e.target.value) });
          }}
          label={`Monto ${gasto.nro}`}
        />
      </Grid>
      <Grid item md={2} style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleRemoveGasto(item.nro)}
        >
          X
        </Button>
      </Grid>
    </Grid>
  );
};

export default EgresoItemGasto;

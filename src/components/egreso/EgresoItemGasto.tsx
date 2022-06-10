import { Button, Grid, InputAdornment, TextField } from "@mui/material";
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
    gasto: "",
    monto: "",
  });

  useEffect(() => {
    if (item) {
      setGasto({
        nro: item.nro,
        gasto: item.gasto,
        monto: item.monto,
      });
    }
  }, [item]);

  return (
    <Grid spacing={3} container style={{ paddingLeft: 16, paddingTop: 16 }}>
      <Grid item md={6}>
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
            if (typeof decimal === "string" && decimal.length <= 2) {
              const ele = itemsGasto.map((res: any) => {
                return {
                  ...res,
                  monto: res.nro === item.nro ? e.target.value : res.monto,
                };
              });
              setItemsGasto(ele);
              setGasto({ ...gasto, monto: e.target.value });
            }
            if (typeof decimal === "boolean" && decimal === false) {
              const ele = itemsGasto.map((res: any) => {
                return {
                  ...res,
                  monto: res.nro === item.nro ? e.target.value : res.monto,
                };
              });
              setItemsGasto(ele);
              setGasto({ ...gasto, monto: e.target.value });
            }
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

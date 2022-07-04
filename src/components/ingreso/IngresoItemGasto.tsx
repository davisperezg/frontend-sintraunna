import { Button, Grid, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface Props {
  handleRemoveGasto: (item: number) => void;
  item: any;
  setItemsIngresos: any;
  itemsIngresos: any;
}

const IngresoItem = ({
  item,
  handleRemoveGasto,
  setItemsIngresos,
  itemsIngresos,
}: Props) => {
  const [itemI, setItemI] = useState({
    nro: "",
    proyecto: "",
    concepto: "",
    importe: "",
  });

  useEffect(() => {
    if (item) {
      setItemI({
        nro: item.nro,
        proyecto: item.proyecto,
        concepto: item.concepto,
        importe: item.importe,
      });
    }
  }, [item]);

  return (
    <Grid spacing={1} container style={{ paddingLeft: 16, paddingTop: 16 }}>
      <Grid item md={2}>
        <TextField
          fullWidth
          required
          value={itemI.proyecto}
          onChange={(e) => {
            const ele = itemsIngresos.map((res: any) => {
              return {
                ...res,
                proyecto: res.nro === item.nro ? e.target.value : res.proyecto,
              };
            });
            setItemsIngresos(ele);
            setItemI({ ...itemI, proyecto: e.target.value });
          }}
          label={`Proyecto`}
        />
      </Grid>
      <Grid item md={5}>
        <TextField
          fullWidth
          required
          value={itemI.concepto}
          onChange={(e) => {
            const ele = itemsIngresos.map((res: any) => {
              return {
                ...res,
                concepto: res.nro === item.nro ? e.target.value : res.concepto,
              };
            });
            setItemsIngresos(ele);
            setItemI({ ...itemI, concepto: e.target.value });
          }}
          label={`Concepto ${itemI.nro}`}
        />
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
          value={itemI.importe}
          onChange={(e) => {
            const value = e.target.value;
            const arr = value.split(".");
            const decimal = arr.length >= 2 && arr[1];
            if (Number(value) < 0) return;
            if (typeof decimal === "string" && decimal.length <= 2) {
              const ele = itemsIngresos.map((res: any) => {
                return {
                  ...res,
                  importe: res.nro === item.nro ? e.target.value : res.importe,
                };
              });
              setItemsIngresos(ele);
              setItemI({ ...itemI, importe: e.target.value });
            }
            if (typeof decimal === "boolean" && decimal === false) {
              const ele = itemsIngresos.map((res: any) => {
                return {
                  ...res,
                  importe: res.nro === item.nro ? e.target.value : res.importe,
                };
              });
              setItemsIngresos(ele);
              setItemI({ ...itemI, importe: e.target.value });
            }
          }}
          label={`Importe ${itemI.nro}`}
        />
      </Grid>
      <Grid item md={2} style={{ display: "flex" }}>
        <Button
          variant="contained"
          color="error"
          style={{ width: "100%" }}
          onClick={() => handleRemoveGasto(item.nro)}
        >
          X
        </Button>
      </Grid>
    </Grid>
  );
};

export default IngresoItem;

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useMemo, useRef } from "react";
import { IModal } from "../../interface/Modal";
import { formatDate, formatter } from "../../utils/helpers/functions";
import { useEgresos } from "../hooks/useEgreso";
import { useReactToPrint } from "react-to-print";

const ConsultaEgresoListModal = ({ handleClose, open }: IModal) => {
  const { data, isLoading, isError, error } = useEgresos();
  const componentRef = useRef(null);

  const reactToPrintContent = () => componentRef.current;

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "CONSULTA EGRESOS",
    removeAfterPrint: true,
  });

  const monto = useMemo(() => {
    const calc = (data as any)?.map((a: any) => {
      return a.gastos?.reduce((prev: any, curr: any) => {
        return prev + curr.monto;
      }, 0);
    });

    return calc || [0];
  }, [data]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <div ref={componentRef}>
        <DialogTitle id="alert-dialog-title">Total de egresos</DialogTitle>
        <DialogContent>
          <h3>
            Importe general de egresos:{" S/"}
            {formatter.format(
              monto?.reduce((prev: any, curr: any) => prev + curr, 0)
            )}
          </h3>
          <table
            style={{
              marginTop: 10,
              border: "1px solid",
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid",
                    fontWeight: 700,
                    height: 24,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    verticalAlign: "middle",
                    // borderLeft: "1px solid transparent",
                    // borderRight: "1px solid transparent",
                    textAlign: "left",
                  }}
                >
                  <div style={{ textAlign: "left", width: 100, padding: 5 }}>
                    #
                  </div>
                </th>
                <th style={{ border: "1px solid" }}>Fecha</th>
                <th style={{ border: "1px solid" }}>Nombre del destinatario</th>
                <th style={{ border: "1px solid" }}>Detalle del egreso</th>
                <th style={{ border: "1px solid" }}>Gastos</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((a, i: number) => {
                return (
                  <tr key={i + 1}>
                    <td style={{ border: "1px solid" }}>{i + 1}</td>
                    <td style={{ border: "1px solid" }}>
                      {formatDate(new Date(String(a.fecha)), false)}
                    </td>
                    <td style={{ border: "1px solid" }}>
                      {a.nombre_destinatario}
                    </td>
                    <td style={{ border: "1px solid" }}>{a.detalle_egreso}</td>
                    <td style={{ border: "1px solid" }}>
                      {a.gastos.map((b) => {
                        return (
                          <div key={b.nro}>
                            <ul style={{ display: "flex" }}>
                              <li style={{ listStyle: "none" }}>{b.nro}.- </li>
                              <li style={{ listStyle: "none" }}>
                                {" "}
                                {b.gasto} -{" "}
                              </li>
                              <li style={{ listStyle: "none" }}>
                                S/{formatter.format(b.monto)}
                              </li>
                            </ul>
                          </div>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </DialogContent>
      </div>
      <DialogActions>
        <Button
          color="error"
          variant="contained"
          onClick={handlePrint}
          disabled={isLoading}
        >
          Imprimir
        </Button>
        <Button style={{ color: "black" }} onClick={handleClose}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConsultaEgresoListModal;

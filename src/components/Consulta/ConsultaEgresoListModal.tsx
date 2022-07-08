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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              position: "relative",
              border: "0 solid #eee",
              overflow: "hidden",
              color: "#000",
            }}
          >
            <div
              style={{
                flex: "0 0 auto",
                backgroundColor: "#f4f4f4",
                position: "relative",
                border: "1px solid #d0cecf",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  float: "left",
                  paddingRight: "40px",
                  color: "#464646",
                }}
              >
                <table
                  style={{
                    borderRight: "1px solid #fff",
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          borderRight: "1px solid #d0cecf",
                          borderLeft: "1px solid transparent",
                          fontWeight: 700,
                          height: 24,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            textAlign: "left",
                            width: 100,
                            padding: 5,
                            borderLeft: "0 solid transparent",
                            fontSize: 12,
                            fontFamily: "Arial",
                          }}
                        >
                          #
                        </div>
                      </th>
                      <th
                        style={{
                          borderRight: "1px solid #d0cecf",
                          borderLeft: "1px solid transparent",
                          fontWeight: 700,
                          height: 24,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            textAlign: "left",
                            width: 100,
                            padding: 5,
                            borderLeft: "0 solid transparent",
                            fontSize: 12,
                            fontFamily: "Arial",
                          }}
                        >
                          Fecha
                        </div>
                      </th>
                      <th
                        style={{
                          borderRight: "1px solid #d0cecf",
                          borderLeft: "1px solid transparent",
                          fontWeight: 700,
                          height: 24,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            textAlign: "left",
                            width: 160,
                            padding: 5,
                            borderLeft: "0 solid transparent",
                            fontSize: 12,
                            fontFamily: "Arial",
                          }}
                        >
                          Nombre del destinatario
                        </div>
                      </th>
                      <th
                        style={{
                          borderRight: "1px solid #d0cecf",
                          borderLeft: "1px solid transparent",
                          fontWeight: 700,
                          height: 24,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            textAlign: "left",
                            width: 160,
                            padding: 5,
                            borderLeft: "0 solid transparent",
                            fontSize: 12,
                            fontFamily: "Arial",
                          }}
                        >
                          Detalle del egreso
                        </div>
                      </th>
                      <th
                        style={{
                          borderRight: "1px solid #d0cecf",
                          borderLeft: "1px solid transparent",
                          fontWeight: 700,
                          height: 24,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          verticalAlign: "middle",
                          cursor: "pointer",
                          textAlign: "left",
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            textAlign: "left",
                            width: 160,
                            padding: 5,
                            borderLeft: "0 solid transparent",
                            fontSize: 12,
                            fontFamily: "Arial",
                          }}
                        >
                          Gastos
                        </div>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            </div>
            <div
              style={{
                flex: "1 1 auto",
                backgroundColor: "#fff",
                position: "relative",
                border: "1px solid #d0cecf",
                overflow: "auto",
                width: "100%",
                color: "#000",
                userSelect: "text",
                height: "620px",
                borderTop: 0,
              }}
            >
              <table
                style={{
                  display: "table",
                  marginBottom: "10px",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {data?.map((a, i: number) => {
                    return (
                      <tr key={i + 1}>
                        <td
                          style={{
                            borderRight: "1px solid #d0cecf",
                            borderLeft: "1px solid transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            textAlign: "left",
                            padding: 0,
                            borderBottom: "1px solid #e2e2e2",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "left",
                              width: 100,
                              padding: 5,
                              paddingBottom: 4,
                              minWidth: 0,
                              borderTop: "0 solid transparent",
                              borderLeft: "0 solid transparent",
                              fontSize: 12,
                              fontFamily: "Arial",
                            }}
                          >
                            {i + 1}
                          </div>
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid #d0cecf",
                            borderLeft: "1px solid transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            textAlign: "left",
                            padding: 0,
                            borderBottom: "1px solid #e2e2e2",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "left",
                              width: 100,
                              padding: 5,
                              paddingBottom: 4,
                              minWidth: 0,
                              borderTop: "0 solid transparent",
                              borderLeft: "0 solid transparent",
                              fontSize: 12,
                              fontFamily: "Arial",
                            }}
                          >
                            {formatDate(new Date(String(a.fecha)), false)}
                          </div>
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid #d0cecf",
                            borderLeft: "1px solid transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            textAlign: "left",
                            padding: 0,
                            borderBottom: "1px solid #e2e2e2",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "left",
                              width: 160,
                              padding: 5,
                              paddingBottom: 4,
                              minWidth: 0,
                              borderTop: "0 solid transparent",
                              borderLeft: "0 solid transparent",
                              fontSize: 12,
                              fontFamily: "Arial",
                            }}
                          >
                            {a.nombre_destinatario}
                          </div>
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid #d0cecf",
                            borderLeft: "1px solid transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            textAlign: "left",
                            padding: 0,
                            borderBottom: "1px solid #e2e2e2",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "left",
                              width: 160,
                              padding: 5,
                              paddingBottom: 4,
                              minWidth: 0,
                              borderTop: "0 solid transparent",
                              borderLeft: "0 solid transparent",
                              fontSize: 12,
                              fontFamily: "Arial",
                            }}
                          >
                            {a.detalle_egreso}
                          </div>
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid #d0cecf",
                            borderLeft: "1px solid transparent",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            verticalAlign: "middle",
                            textAlign: "left",
                            padding: 0,
                            borderBottom: "1px solid #e2e2e2",
                          }}
                        >
                          <div
                            style={{
                              textAlign: "left",
                              width: 160,
                              padding: 5,
                              paddingBottom: 4,
                              minWidth: 0,
                              borderTop: "0 solid transparent",
                              borderLeft: "0 solid transparent",
                              fontSize: 12,
                              fontFamily: "Arial",
                            }}
                          >
                            {a.gastos.map((b) => {
                              return (
                                <div key={b.nro}>
                                  <ul style={{ display: "flex" }}>
                                    <li style={{ listStyle: "none" }}>
                                      {b.nro}.-{" "}
                                    </li>
                                    <li style={{ listStyle: "none" }}>
                                      {" "}
                                      {b.gasto} -{" "}
                                    </li>
                                    <li style={{ listStyle: "none" }}>
                                      S/{formatter.format(b.monto)} -{" "}
                                    </li>
                                    <li
                                      style={{
                                        listStyle: "none",
                                        fontWeight: 700,
                                      }}
                                    >
                                      {b.proviene_dinero}
                                    </li>
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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

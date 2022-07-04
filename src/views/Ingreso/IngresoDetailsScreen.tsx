import { Alert } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../../components/breadcrumbs/BreadStyle";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useIngreso } from "../../components/hooks/useIngreso";
import { Afiliado } from "../../interface/Afiliado";
import { formatDate, formatter } from "../../utils/helpers/functions";
import { Table } from "../IndexStyle";
import { ButtonPrint, TitlePrint } from "./IngresoStyle";

const IngresoDetailsScreen = () => {
  const [
    idModule,
    idMenu,
    _,
    module,
    isLoadingModule,
    isErrorModule,
    errorModule,
  ] = useBreadcrumbs();
  const navigate = useNavigate();
  const { idIngreso } = useParams();
  const { data, isLoading, isError, error } = useIngreso(idIngreso as string);

  const goPage = () => {
    navigate(`/module/${idModule}/menu/${idMenu}/ingresos`);
  };

  const print = () => {
    const prtContent = document.getElementById("content");
    let WinPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );
    WinPrint!.document.write(prtContent!.innerHTML);
    WinPrint!.document.close();
    WinPrint!.focus();
    WinPrint!.print();
    WinPrint!.close();
  };

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Detalle"
        addTitle={
          <Title to={`/module/${idModule}/menu/${idMenu}/ingresos`}>
            Ingresos
          </Title>
        }
      />

      {isLoading ? (
        "Cargando data..."
      ) : isError ? (
        <Alert severity="error">
          {JSON.parse(String(error?.request.response)).message}
        </Alert>
      ) : (
        <div id="content">
          <h1>
            Liquidación de Planilla - INGRESO -{" "}
            {data?.status ? (
              <strong style={{ color: "green" }}>Habilitado</strong>
            ) : (
              <strong style={{ color: "white", backgroundColor: "red" }}>
                Anulado
              </strong>
            )}
          </h1>
          <div style={{ display: "flex" }}>
            <div
              style={{ display: "flex", flexDirection: "column", width: "50%" }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Fecha:</strong>&nbsp;&nbsp;
                <label style={{ backgroundColor: "yellow" }}>
                  {formatDate(new Date(String(data?.fecha)), false)}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Fecha de creación del ingreso:</strong>
                &nbsp;&nbsp;
                <label>
                  {formatDate(new Date(String(data?.createdAt)), true)}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Ultima actualización:</strong>&nbsp;&nbsp;
                <label>
                  {formatDate(new Date(String(data?.updatedAt)), true)}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>La liquidación fue creado por:</strong>&nbsp;&nbsp;
                <label>{data?.createBy}</label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>La liquidación fue actualizada por:</strong>&nbsp;&nbsp;
                <label>{data?.updateBy}</label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>La liquidación fue anulada por:</strong>&nbsp;&nbsp;
                <label>{data?.deleteBy}</label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>La liquidación fue restaurada por:</strong>&nbsp;&nbsp;
                <label>{data?.restoreBy}</label>
              </div>
              <br />
              <br />
              {data?.updateBy !== "NINGUNO" && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <strong>Motivo de la actualización:</strong>
                  &nbsp;&nbsp;
                  <label>{data?.motivo_editacion}</label>
                </div>
              )}
              {data?.deleteBy !== "NINGUNO" && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <strong>Motivo de la anulación:</strong>
                  &nbsp;&nbsp;
                  <label>{data?.motivo_anulacion}</label>
                </div>
              )}
              {data?.restoreBy !== "NINGUNO" && (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <strong>Motivo de la restauración:</strong>
                  &nbsp;&nbsp;
                  <label>{data?.motivo_restauracion}</label>
                </div>
              )}
              <br />
              <br />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Afiliado:</strong>&nbsp;&nbsp;
                <label>
                  {(data?.afiliado as Afiliado).nombres +
                    " " +
                    (data?.afiliado as Afiliado).apellidos}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Detalle del ingreso:</strong>&nbsp;&nbsp;
                <label>{data?.detalle_ingreso}</label>
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
                    {data?.ingresos_afiliado.map((item) => (
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
                        {formatter.format(
                          data!.ingresos_afiliado.reduce((a, b) => {
                            return Number(a) + Number(b.importe);
                          }, 0)
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </Table>
            </div>
          </div>
        </div>
        //  <ButtonPrint onClick={print}>Imprimir</ButtonPrint>
      )}
    </>
  );
};

export default IngresoDetailsScreen;

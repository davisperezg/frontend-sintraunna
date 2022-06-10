import { Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../../components/breadcrumbs/BreadStyle";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useEgreso } from "../../components/hooks/useEgreso";
import { formatDate, formatter } from "../../utils/helpers/functions";
import { Table } from "../IndexStyle";
import { ButtonPrint } from "./EgresoStyle";

const EgresoDetailsScreen = () => {
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
  const { idEgreso } = useParams();
  const { data, isLoading, isError, error } = useEgreso(idEgreso as string);

  const goPage = () => {
    navigate(`/module/${idModule}/menu/${idMenu}/egresos`);
  };

  const print = () => {
    const prtContent = document.getElementById("gastos");
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
          <Title to={`/module/${idModule}/menu/${idMenu}/egresos`}>
            Egresos
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
        <div id="gastos" style={{ position: "relative" }}>
          <ButtonPrint onClick={print}>Imprimir</ButtonPrint>

          <h1>
            Liquidación de Planilla - SALIDA -{" "}
            {data?.status ? (
              <strong style={{ color: "green" }}>Habilitado</strong>
            ) : (
              <strong style={{ color: "white", backgroundColor: "red" }}>
                Anulado
              </strong>
            )}
          </h1>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>Fecha:</strong>&nbsp;&nbsp;
              <label style={{ backgroundColor: "yellow" }}>
                {formatDate(new Date(String(data?.fecha)), false)}
              </label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>Fecha de creación de la liquidación:</strong>&nbsp;&nbsp;
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
              <strong>La liquidación fue creado por:</strong>
              &nbsp;&nbsp;
              <label>{data?.createBy}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>La liquidación fue actualizada por:</strong>
              &nbsp;&nbsp;
              <label>{data?.updateBy}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>La liquidación fue eliminada por:</strong>
              &nbsp;&nbsp;
              <label>{data?.deleteBy}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>La liquidación fue restaurada por:</strong>
              &nbsp;&nbsp;
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
              <strong>Fase de copa Perú:</strong>&nbsp;&nbsp;
              <label>{data?.fase_copaPeru}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>Partido VS:</strong>&nbsp;&nbsp;
              <label>{data?.partido_vs}</label>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <strong>El encuentro se jugó de:</strong>&nbsp;&nbsp;
              <label>{data?.local_visita}</label>
            </div>
            <br />
            <br />

            <Table style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Nro</th>
                    <th>Detalle de gasto</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.gastos.map((item) => (
                    <tr key={item.nro}>
                      <td>{item.nro}</td>
                      <td>{item.gasto}</td>
                      <td>S/{formatter.format(item.monto)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{ backgroundColor: "red", color: "#fff" }}>
                  <tr>
                    <td colSpan={2}>Total</td>
                    <td>
                      S/
                      {formatter.format(
                        data!.gastos.reduce((a, b) => {
                          return Number(a) + Number(b.monto);
                        }, 0)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default EgresoDetailsScreen;

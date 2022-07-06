import { useMemo } from "react";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import ConsultaList from "../../components/Consulta/ConsultaList";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useConsultaGeneral } from "../../components/hooks/useConsulta";
import { useAccess } from "../../components/hooks/useResources";
import { columnConsultaPagos } from "../../consts/columns";
import { formatter } from "../../utils/helpers/functions";
import { OptionsConsultaGeneral } from "./ConsultaStyle";

const ConsultaGeneral = () => {
  const [
    idModule,
    idMenu,
    goPage,
    module,
    isLoadingModule,
    isErrorModule,
    errorModule,
  ] = useBreadcrumbs();
  const {
    data: dataAccess,
    isLoading: isLoadingAccess,
    isError: isErrorAccess,
    error: errorAccess,
  } = useAccess();
  const {
    isLoading: isLoadingPagos,
    data: dataPagos,
    isError: isErrorPagos,
    error: errorPagos,
  } = useConsultaGeneral();

  const data = useMemo(() => dataPagos || [], [dataPagos]);
  const columns = useMemo(() => columnConsultaPagos, []);

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

  const monto = useMemo(() => {
    const calc = (data as any).map((a: any) => {
      return a.pagos.reduce((prev: any, curr: any) => {
        return prev + curr.importe;
      }, 0);
    });

    return calc;
  }, [data]);

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Consulta general"
      />
      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse con soporte"
      ) : dataAccess.some((a: any) => a === "canRead_consultaGeneral") ? (
        <>
          <OptionsConsultaGeneral>
            <button onClick={print}>Imprimir</button>
          </OptionsConsultaGeneral>

          <div id="content">
            <div style={{ paddingLeft: 10 }}>
              <label style={{ color: "green" }}>
                Importe general:{" "}
                <strong>
                  S/{" "}
                  {formatter.format(
                    monto.reduce((prev: any, curr: any) => prev + curr, 0)
                  )}
                </strong>
              </label>
            </div>
            {isLoadingPagos ? (
              isErrorPagos ? (
                "Ha ocurrido un error al listar la consulta general"
              ) : (
                "Cargando datos..."
              )
            ) : (
              <ConsultaList data={data as any[]} columns={columns} />
            )}
          </div>
        </>
      ) : (
        "Usted no tiene el permiso para consultar"
      )}
    </>
  );
};

export default ConsultaGeneral;

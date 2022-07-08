import { TextField } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import ConsultaList from "../../components/Consulta/ConsultaList";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useConsultaGeneral } from "../../components/hooks/useConsulta";
import { useAccess } from "../../components/hooks/useResources";
import { columnConsultaPagos } from "../../consts/columns";
import { formatter } from "../../utils/helpers/functions";
import { ContentSearch, OptionsConsultaGeneral } from "./ConsultaStyle";
import { useReactToPrint } from "react-to-print";
import ConsultaEgresoListModal from "../../components/Consulta/ConsultaEgresoListModal";
import { useEgresos } from "../../components/hooks/useEgreso";

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
  const [buscar, setBuscar] = useState("");
  const componentRef = useRef(null);
  const [showMEgresos, setShowMEgresos] = useState(false);
  const { data: dataEgresos, isLoading, isError, error } = useEgresos();

  const reactToPrintContent = () => componentRef.current;

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "CONSULTA GENERAL",
    removeAfterPrint: true,
  });

  const data = useMemo(() => {
    let consultFiltered = dataPagos;

    if (buscar !== "") {
      consultFiltered = (dataPagos as any)?.filter((a: any) => {
        return String(a.afiliado)
          .toLowerCase()
          .includes(buscar.toLowerCase().trim());
      });
    }

    return consultFiltered || [];
  }, [dataPagos, buscar]);

  const montoEgresos = useMemo(() => {
    const calc = (dataEgresos as any)?.map((a: any) => {
      return a.gastos?.reduce((prev: any, curr: any) => {
        return prev + curr.monto;
      }, 0);
    });

    return calc || [0];
  }, [dataEgresos]);

  const columns = useMemo(() => columnConsultaPagos, []);

  const handleSearch = (e: any) => {
    setBuscar(e.target.value);
  };

  const monto = useMemo(() => {
    const calc = (data as any)?.map((a: any) => {
      return a.pagos?.reduce((prev: any, curr: any) => {
        return prev + curr.importe;
      }, 0);
    });

    return calc || [0];
  }, [data]);

  const montoAbiliado = useMemo(() => {
    const calc = (data as any)?.map((a: any) => {
      return a.pagos
        ?.filter((b: any) => {
          return b.destino_dinero === "ABILIO CORONADO";
        })
        .reduce((prev: any, curr: any) => {
          return prev + curr.importe;
        }, 0);
    });

    return calc || [0];
  }, [data]);

  const montoOlger = useMemo(() => {
    const calc = (data as any)?.map((a: any) => {
      return a.pagos
        ?.filter((b: any) => {
          return b.destino_dinero === "OLGER PEREZ";
        })
        .reduce((prev: any, curr: any) => {
          return prev + curr.importe;
        }, 0);
    });

    return calc || [0];
  }, [data]);

  const showModalEgresos = () => {
    setShowMEgresos(true);
  };

  const closeModalEgresos = () => {
    setShowMEgresos(false);
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
        nameMenu="Consulta general"
      />
      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse con soporte"
      ) : dataAccess?.some((a: any) => a === "canRead_consultaGeneral") ? (
        <>
          <ContentSearch>
            <TextField
              id="outlined-name"
              label="Buscar afiliado"
              value={buscar}
              onChange={handleSearch}
              fullWidth
              autoFocus
            />
          </ContentSearch>
          <OptionsConsultaGeneral>
            <button onClick={handlePrint}>Imprimir</button>
          </OptionsConsultaGeneral>

          {showMEgresos && (
            <ConsultaEgresoListModal
              handleClose={closeModalEgresos}
              open={showMEgresos}
            />
          )}

          <div ref={componentRef}>
            <div style={{ paddingLeft: 10 }}>
              <h3>Relevo caja anterior: S/8150.00</h3>

              <h3>
                Importe total de personas que han depositado a Abilio Coronado:
                {" S/"}
                {formatter.format(
                  montoAbiliado?.reduce(
                    (prev: any, curr: any) => prev + curr,
                    0
                  )
                )}
              </h3>
              <h3>
                Importe total de personas que han depositado a Olger Pérez:
                {" S/"}
                {formatter.format(
                  montoOlger?.reduce((prev: any, curr: any) => prev + curr, 0)
                )}
              </h3>
              <h3>-------------------------------------------------</h3>
              <h3>
                Importe general de afiliado
                {buscar === "" ? "s" : (data as any[]).length === 1 ? "" : "s"}:
                S/{" "}
                {formatter.format(
                  monto?.reduce((prev: any, curr: any) => prev + curr, 0)
                )}
              </h3>
              {buscar === "" && (
                <>
                  <h3>
                    Importe general de egresos: S/{" "}
                    {formatter.format(
                      montoEgresos?.reduce(
                        (prev: any, curr: any) => prev + curr,
                        0
                      )
                    )}
                    {" - "}
                    <label
                      style={{
                        color: "red",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={showModalEgresos}
                    >
                      Ver egresos
                    </label>
                  </h3>
                  <h3>-------------------------------------------------</h3>
                  <h3>
                    Resumen: S/{" "}
                    {formatter.format(
                      Number(
                        monto?.reduce((prev: any, curr: any) => prev + curr, 0)
                      ) -
                        Number(
                          montoEgresos?.reduce(
                            (prev: any, curr: any) => prev + curr,
                            0
                          )
                        )
                    )}
                  </h3>
                </>
              )}
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

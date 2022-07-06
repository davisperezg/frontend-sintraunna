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
        return String(a.afiliado).toLowerCase().includes(buscar.toLowerCase());
      });
    }

    return consultFiltered || [];
  }, [dataPagos, buscar]);
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

          <div ref={componentRef}>
            <div style={{ paddingLeft: 10 }}>
              <h3>
                Importe general: S/{" "}
                {formatter.format(
                  monto?.reduce((prev: any, curr: any) => prev + curr, 0)
                )}
              </h3>
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

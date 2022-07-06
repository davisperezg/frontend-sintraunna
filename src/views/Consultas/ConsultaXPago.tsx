import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import ConsultaList from "../../components/Consulta/ConsultaList";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import {
  useConsultaXpago,
  usePagosConsults,
} from "../../components/hooks/useConsulta";
import { useAccess } from "../../components/hooks/useResources";
import { columnConsultaXpao } from "../../consts/columns";
import { formatter } from "../../utils/helpers/functions";
import { Options } from "../IndexStyle";
import { OptionsConsultaXpago } from "./ConsultaStyle";

const ConsultaXPago = () => {
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
    data: pagos,
    isLoading: isLoadingPagos,
    isError: isErrorPagos,
  } = usePagosConsults();

  const [pago, setPago] = useState("");
  const {
    isLoading: isLoadingCPago,
    // isFetching: isFetchingCPago,
    data: dataCPago,
    isError: isErrorCPago,
    // error: errorCPago,
    refetch: refetchCPago,
  } = useConsultaXpago(pago);
  const componentRef = useRef(null);

  const handleChange = (e: any) => {
    setPago(e.target.value);
  };

  const data = useMemo(() => dataCPago || [], [dataCPago]);

  const goConsult = () => {
    refetchCPago();
  };

  const columns = useMemo(() => columnConsultaXpao, []);

  const monto = useMemo(() => {
    const calc = (data as any)?.map((a: any) => {
      return a.pagos?.reduce((prev: any, curr: any) => {
        return prev + curr.importe;
      }, 0);
    });

    return calc || [0];
  }, [data]);

  const reactToPrintContent = () => componentRef.current;

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "CONSULTA X CUOTA",
    removeAfterPrint: true,
  });

  return (
    <>
      <MyBreadcrumbs
        goPage={goPage}
        idMenu={idMenu}
        idModule={idModule}
        module={module}
        isLoadingModule={isLoadingModule}
        isErrorModule={isErrorModule}
        nameMenu="Consulta por pago"
      />
      {isLoadingAccess ? (
        "Verificando permisos..."
      ) : isErrorAccess ? (
        "Ha ocurrido un error por favor comunicarse con soporte"
      ) : dataAccess?.some((a: any) => a === "canRead_consultaXpago") ? (
        <>
          <OptionsConsultaXpago>
            <div>
              <FormControl style={{ width: 200 }}>
                <InputLabel id="demo-simple-select-label">
                  [Seleccione un pago]
                </InputLabel>
                <Select
                  labelId="pago-simple-select-label"
                  id="demo-simple-select"
                  value={pago}
                  label="[Seleccione un pago]"
                  onChange={handleChange}
                >
                  {isLoadingPagos ? (
                    <MenuItem>Cargando pagos...</MenuItem>
                  ) : (
                    pagos?.map((a, i: number) => (
                      <MenuItem key={i + 1} value={a._id}>
                        {a.concepto}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              <Button
                style={{ marginLeft: 10 }}
                onClick={goConsult}
                color="error"
                disabled={pago !== "" ? false : true}
                variant="contained"
              >
                Consultar
              </Button>
            </div>
            <div>
              <button onClick={handlePrint}>Imprimir</button>
            </div>
          </OptionsConsultaXpago>
          <div ref={componentRef}>
            <div style={{ paddingLeft: 10 }}>
              <h3>
                Importe general: S/{" "}
                {formatter.format(
                  monto.reduce((prev: any, curr: any) => prev + curr, 0)
                )}
              </h3>
            </div>
            {isLoadingCPago ? (
              isErrorCPago ? (
                "Ha ocurrido un error al listar la consulta de pago"
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

export default ConsultaXPago;

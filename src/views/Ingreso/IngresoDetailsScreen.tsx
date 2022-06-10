import {
  Alert,
  AppBar,
  Button,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Title } from "../../components/breadcrumbs/BreadStyle";
import MyBreadcrumbs from "../../components/breadcrumbs/Index";
import { Transition } from "../../components/General/ComponentsIndex";
import { useBreadcrumbs } from "../../components/hooks/useBreadcrumbs";
import { useEgresos } from "../../components/hooks/useEgreso";
import { useIngreso } from "../../components/hooks/useIngreso";
import { BASE_API } from "../../consts/api";
import { Egreso } from "../../interface/Egreso";
import { formatDate, formatter } from "../../utils/helpers/functions";
import { Table } from "../IndexStyle";
import CloseIcon from "@mui/icons-material/Close";
import { ButtonPrint, TitlePrint } from "./IngresoStyle";

const initialEgreso: Egreso = {
  fecha: new Date(),
  partido_vs: "",
  local_visita: "Local",
  fase_copaPeru: "",
  gastos: [],
};

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
  const {
    data: dataEgresos,
    isLoading: isLoadingEgresos,
    isError: isErrorEgresos,
    error: errorEgresos,
  } = useEgresos();
  const [selectEgreso, setSelectEgreso] = useState("");
  const [egreso, setEgreso] = useState<Egreso>(initialEgreso);
  const [activeBtn, setActiveBtn] = useState<boolean>(false);
  const [openFull, setOpenFull] = useState(false);

  const handlePrevia = () => {
    setOpenFull(true);
  };

  const handleCloseFull = () => {
    setOpenFull(false);
  };

  const goPage = () => {
    navigate(`/module/${idModule}/menu/${idMenu}/ingresos`);
  };

  const handleChange = (e: any) => {
    setActiveBtn(false);
    setSelectEgreso(e.target.value);
  };

  const handleClick = async () => {
    setActiveBtn(true);
    const { data } = await axios.get(
      `${BASE_API}/api/v1/egresos/find/${selectEgreso}`
    );
    setEgreso({
      fecha: data.fecha,
      partido_vs: data.partido_vs,
      local_visita: data.local_visita,
      fase_copaPeru: data.fase_copaPeru,
      gastos: data.gastos,
    });
  };

  const ingresoTotal = useMemo(() => {
    const result =
      Number(data?.ingreso_total_actividad) +
      Number(data?.ingreso_apoyo_tribuna) +
      Number(data?.ingreso_cuota_dirigentes) +
      Number(data?.otros_ingresos) +
      Number(data?.ingreso_taquilla);
    return result;
  }, [
    data?.ingreso_apoyo_tribuna,
    data?.ingreso_cuota_dirigentes,
    data?.ingreso_taquilla,
    data?.ingreso_total_actividad,
    data?.otros_ingresos,
  ]);

  const salidaTotal = useMemo(
    () => egreso.gastos.reduce((a, b) => Number(a) + Number(b.monto), 0),
    [egreso.gastos]
  );

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

  const printGastos = () => {
    const prtContent = document.getElementById("full");
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
      <Dialog
        fullScreen
        open={openFull}
        onClose={handleCloseFull}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFull}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              GASTOS {formatDate(new Date(String(egreso.fecha)), false)} -
              SALIDA
            </Typography>
            <Button autoFocus color="inherit" onClick={printGastos}>
              IMPRIMIR
            </Button>
          </Toolbar>
        </AppBar>
        <div id="full">
          <div
            style={{ display: "flex", flexDirection: "column", padding: 24 }}
          >
            <TitlePrint>
              GASTOS {formatDate(new Date(String(egreso.fecha)), false)} -
              SALIDA
            </TitlePrint>
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
                  {egreso.gastos.map((item) => (
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
                      {formatter.format(salidaTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </Table>
          </div>
        </div>
      </Dialog>

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
                <strong>Fecha de creación de la liquidación:</strong>
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
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Se realizó actividad:</strong>&nbsp;&nbsp;
                <label>{String(data?.realizo_actividad).toUpperCase()}</label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Nombre de actividad:</strong>&nbsp;&nbsp;
                <label>
                  {String(data?.realizo_actividad).toUpperCase() === "NO"
                    ? "NINGUNA"
                    : data?.nombre_actividad}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Ingreso total de actividad:</strong>&nbsp;&nbsp;
                <label>
                  S/{formatter.format(Number(data?.ingreso_total_actividad))}
                </label>
              </div>
              <br />
              <br />
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Ingreso de apoyo tribuna:</strong>&nbsp;&nbsp;
                <label>
                  S/{formatter.format(Number(data?.ingreso_apoyo_tribuna))}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Ingreso cuotas de dirigentes:</strong>&nbsp;&nbsp;
                <label>
                  S/{formatter.format(Number(data?.ingreso_cuota_dirigentes))}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Otros ingresos:</strong>&nbsp;&nbsp;
                <label>
                  S/{formatter.format(Number(data?.otros_ingresos))}
                </label>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Ingreso taquilla:</strong>&nbsp;&nbsp;
                <label>
                  S/{formatter.format(Number(data?.ingreso_taquilla))}
                </label>
              </div>
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: activeBtn ? "yellow" : "green",
                  color: activeBtn ? "#000" : "white",
                  padding: 20,
                }}
              >
                <strong>Ingreso Total:</strong>&nbsp;&nbsp;
                <label>
                  S/
                  {formatter.format(ingresoTotal)}
                </label>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <strong>Comparar con liquidación de planilla - SALIDA:</strong>
                &nbsp;&nbsp;
              </div>
              <Grid item md={12}>
                <FormControl fullWidth>
                  <Select
                    required
                    labelId="egreso-select-label"
                    id="egreso-select"
                    value={selectEgreso}
                    displayEmpty
                    onChange={handleChange}
                  >
                    <MenuItem disabled value="">
                      [Seleccione una opción]
                    </MenuItem>
                    {isLoadingEgresos ? (
                      <MenuItem>Cargando egresos...</MenuItem>
                    ) : dataEgresos?.length === 0 ? (
                      <MenuItem disabled={true}>
                        <strong style={{ color: "red" }}>
                          No se encontró ningún egreso. Por favor crea uno
                          nuevo.
                        </strong>
                      </MenuItem>
                    ) : (
                      dataEgresos?.map((egre) => {
                        return (
                          <MenuItem key={egre._id} value={egre._id}>
                            REAL FUJIMORI vs {egre.partido_vs} y jugamos de:
                            {egre.local_visita} - Fase de copa Perú:{" "}
                            {egre.fase_copaPeru}
                          </MenuItem>
                        );
                      })
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "end",
                  marginTop: 20,
                }}
              >
                <Button
                  variant="contained"
                  disabled={activeBtn}
                  onClick={handleClick}
                >
                  Comparar
                </Button>
              </div>
              {activeBtn && (
                <>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <strong>Resumen General:</strong>
                    &nbsp;&nbsp;
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <strong>Gastos:</strong>
                    &nbsp;&nbsp;
                    <label
                      onClick={handlePrevia}
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Ver gastos
                    </label>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <strong>Fecha de gastos:</strong>
                    &nbsp;&nbsp;
                    <label>
                      {formatDate(new Date(String(egreso.fecha)), false)}
                    </label>
                  </div>
                  <br />
                  <br />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <strong>Ingreso total(S/):</strong>
                    &nbsp;&nbsp;
                    <label>{formatter.format(ingresoTotal)}</label>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <strong>Gastos total(S/):</strong>
                    &nbsp;&nbsp;
                    {selectEgreso === ""
                      ? "Esperando selección"
                      : formatter.format(salidaTotal)}
                  </div>
                  <div
                    style={{
                      background: "#ddd",
                      marginTop: 10,
                      marginBottom: 10,
                      height: 1,
                      width: "100%",
                    }}
                  ></div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      backgroundColor:
                        ingresoTotal > salidaTotal ? "green" : "red",
                      color: "#fff",
                    }}
                  >
                    <strong>Utilidad(S/):</strong>
                    &nbsp;&nbsp;
                    {formatter.format(ingresoTotal - salidaTotal)}
                  </div>
                </>
              )}

              <ButtonPrint onClick={print}>Imprimir</ButtonPrint>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngresoDetailsScreen;

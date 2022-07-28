import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState, UIEvent } from "react";
import { IModal } from "../../interface/Modal";
import { formatDate, formatter } from "../../utils/helpers/functions";
import { useEgresos } from "../hooks/useEgreso";
import { useReactToPrint } from "react-to-print";

import {
  ColumnDef,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Header,
  PaginationState,
} from "@tanstack/react-table";
import { Egreso } from "../../interface/Egreso";
import { ITableThItem } from "../../interface/ITableThItem";
import "../MyTable/table.css";

export type TEgreso = {
  index: number;
  fecha: Date;
  nombre_destinatario: string;
  detalle_egreso: string;
  gastos: {
    nro: number;
    gasto: string;
    monto: number;
    proviene_dinero?: string;
  }[];
  actions?: string;
};

const columns: ColumnDef<TEgreso>[] | any[] = [
  {
    accessorKey: "index",
    id: "index",
    classNameBody: "div-row text-center",
    header: () => "#",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
  },
  {
    accessorKey: "fecha",
    id: "fecha",
    cell: ({ getValue }) => {
      return formatDate(new Date(String(getValue())), false);
    },
    classNameBody: "div-row",
    header: () => "Fecha",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  },
  {
    accessorKey: "nombre_destinatario",
    id: "nombre_destinatario",
    classNameBody: "div-row",
    header: () => "Nombre del destinatario",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  },
  {
    accessorKey: "detalle_egreso",
    id: "detalle_egreso",
    classNameBody: "div-row",
    header: () => "Detalle del egreso",
    classNameHeader: "div",
    size: 100,
    minSize: 31,
  },
  {
    accessorKey: "gastos",
    id: "gastos",
    cell: ({ getValue }) => {
      const gastos: any = getValue();
      return gastos.map((a: any, i: number) => {
        return (
          <>
            <span>
              {i +
                1 +
                ".-" +
                a.gasto +
                " - " +
                a.monto +
                " - " +
                a.proviene_dinero}
            </span>
            <br />
          </>
        );
      });
    },
    classNameBody: "div-row",
    header: () => "Gastos",
    classNameHeader: "div text-center",
    size: 100,
    minSize: 31,
  },
  {
    accessorKey: "actions",
    header: () => "...",
    classNameHeader: "div text-center",
    size: 28,
    minSize: 28,
    enableResizing: false,
    enableSorting: false,
  },
];

const ShowOptions = (table: any) => {
  const widthHeader =
    table.props.refContentTHeader.current &&
    table.props.refContentTHeader.current.clientWidth;
  const widthTable = table.props.leftTable;

  const widthGroup =
    table.props.refElement2.current &&
    table.props.refElement2.current.clientWidth;

  const calcScrollHeigth =
    table.props.refElement2.current &&
    table.props.refElement2.current.scrollHeight >
      table.props.refElement2.current.clientHeight;

  const widthInScroll = widthHeader - widthGroup - (calcScrollHeigth ? 34 : 17);
  const widthNoScroll = widthTable - 17;

  return (
    <div
      ref={table.props.refElement2}
      style={{
        backgroundColor: "#fff",
        boxShadow: "0 1px 5px rgb(0 0 0 / 30%)",
        position: "absolute",
        zIndex: 1,
        float: "left",
        overflowX: "hidden",
        overflowY: "auto",
        height: "auto",
        width: "auto",
        whiteSpace: "nowrap",
        visibility: table.props.showOptions ? "visible" : "hidden",
        top: 25.5,
        left: table.props.spacing
          ? table.props.scrolled
            ? widthInScroll
            : widthTable - widthGroup - (calcScrollHeigth ? 6 : -11.5)
          : widthNoScroll,
        maxHeight: 210,
      }}
    >
      {table.props.getAllLeafColumns().map((column: any) => {
        if (column.id !== "actions") {
          return (
            <div
              key={column.id}
              style={{ padding: 8, borderBottom: "1px solid #e2e2e2" }}
            >
              <label
                style={{ display: "block", paddingLeft: 15, textIndent: -15 }}
              >
                <input
                  {...{
                    type: "checkbox",
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                    style: {
                      overflow: "hidden",
                      top: "-3px",
                      position: "relative",
                      verticalAlign: "bottom",
                    },
                  }}
                />{" "}
                {column.id}
              </label>
            </div>
          );
        }
      })}
    </div>
  );
};

const TableThItem = ({
  header,
  refElement1,
  refElement2,
  setShowOptions,
  showOptions,
  table,
  isClicked,
  changeClicked,
  refContentTHeader,
  setSpacing,
  setScrolled,
  setLeftTable,
}: ITableThItem) => {
  return (
    <th
      ref={refElement1}
      className="th"
      {...{
        style: {
          backgroundColor: isClicked ? "#e2e2e2" : "",
        },
        colSpan: header.colSpan,
        onClick: () => {
          if (header.id === "actions") {
            setShowOptions(!showOptions);
            const widthHeader =
              refContentTHeader.current &&
              refContentTHeader.current.clientWidth;
            const widthTable = table.getCenterTotalSize();
            const scrollWBody =
              refContentTHeader.current &&
              refContentTHeader.current.scrollWidth;
            setScrolled(widthHeader - scrollWBody < -25 ? true : false);
            setSpacing(widthHeader - widthTable < 103 ? true : false);
          } else {
            changeClicked();
          }
        },
        //ref: refElement1,
        onMouseOut: () => {
          if (header.id === "actions") {
            if (showOptions) {
              document.onmouseover = function (e) {
                if (
                  (refElement2.current &&
                    refElement2.current.contains(e.target as null)) ||
                  (refElement1.current &&
                    refElement1.current.contains(e.target as null))
                ) {
                  setShowOptions(true);
                } else {
                  setLeftTable(table.getCenterTotalSize());
                  setShowOptions(false);
                  document.onmouseover = null;
                }
              };
            }
          }
        },
      }}
    >
      <div
        {...{
          className: `${
            {
              asc: "asc",
              desc: "desc",
            }[header.column.getIsSorted() as string] ?? ""
          } ${(header.column.columnDef as any).classNameHeader}`,
          style: {
            width: header.column.getSize(),
          },
          onClick: header.column.getToggleSortingHandler(),
        }}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        {/* {{
          asc: " 🔼",
          desc: " 🔽",
        }[header.column.getIsSorted() as string] ?? null} */}
      </div>

      <div
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className:
            header.id !== "actions"
              ? `resizer ${header.column.getIsResizing() ? "isResizing" : ""}`
              : ``,
        }}
      />
    </th>
  );
};

const ConsultaEgresoListModal = ({ handleClose, open }: IModal) => {
  const { data, isLoading, isError, error } = useEgresos();
  //table
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [leftTable, setLeftTable] = useState<number>(0);
  const [clicked, setClicked] = useState<number>(0);
  const [spacing, setSpacing] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const refElement1 = useRef<HTMLTableHeaderCellElement>(null);
  const refElement2 = useRef<HTMLDivElement>(null);
  const refContentTHeader = useRef<HTMLDivElement>(null);
  const refContentTable = useRef<HTMLDivElement>(null);
  const refContentTBody = useRef<HTMLDivElement>(null);

  const [columnResizeMode] = useState<ColumnResizeMode>("onChange");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  //fin table
  const componentRef = useRef(null);

  const reactToPrintContent = () => {
    return componentRef.current;
  };

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

  //table
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const changeClicked = (index: number) => {
    setClicked(index);
  };

  const dataQuery = {
    rows: (data as TEgreso[])
      .map((format, i) => {
        return { ...format, index: i + 1 };
      })
      .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize),
    pageCount: Math.ceil((data as TEgreso[]).length / pageSize),
  };

  const table = useReactTable({
    data: dataQuery.rows,
    columns,
    pageCount: dataQuery.pageCount,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    columnResizeMode,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    if (typeof refContentTHeader === "object") {
      if (refContentTHeader.current) {
        refContentTHeader.current.scrollLeft = e.currentTarget.scrollLeft;
        refContentTHeader.current.scrollTop = e.currentTarget.scrollTop;
      }
    }
  };

  useEffect(() => {
    if (table) {
      setLeftTable(table.getCenterTotalSize());
    }
  }, [table]);
  //fin table

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="md"
      fullWidth
    >
      <div>
        <DialogTitle id="alert-dialog-title">Total de egresos</DialogTitle>
        <DialogContent>
          <h3>
            Importe general de egresos:{" S/"}
            {formatter.format(
              monto?.reduce((prev: any, curr: any) => prev + curr, 0)
            )}
          </h3>

          {/* <MyTableContent data={data} column={myColumn} /> */}
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: "1 1 auto",
                overflow: "hidden",
                border: "0 solid #eee",
                color: "#000",
                position: "relative",
              }}
            >
              <ShowOptions
                props={{
                  ...table,
                  refElement2,
                  leftTable,
                  refContentTHeader,
                  refContentTable,
                  showOptions,
                  spacing,
                  scrolled,
                }}
              />
              <div
                ref={refContentTHeader}
                style={{
                  display: "flex",
                  flex: "0 0 auto",
                  background: "#f4f4f4",
                  position: "relative",
                  border: "1px solid #d0cecf",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{ float: "left", paddingRight: 40, color: "#464646" }}
                >
                  <table
                    style={{
                      borderRight: "1px solid #444",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                          {headerGroup.headers.map((header, i) => {
                            return (
                              <TableThItem
                                key={header.id}
                                header={header}
                                isClicked={clicked === i}
                                changeClicked={() => changeClicked(i)}
                                refElement1={refElement1}
                                refElement2={refElement2}
                                showOptions={showOptions}
                                setShowOptions={setShowOptions}
                                table={table}
                                refContentTHeader={refContentTHeader}
                                setSpacing={setSpacing}
                                setScrolled={setScrolled}
                                setLeftTable={setLeftTable}
                              />
                            );
                          })}
                        </tr>
                      ))}
                    </thead>
                  </table>
                </div>
              </div>
              <div
                onScroll={handleScroll}
                ref={refContentTBody}
                style={{
                  flex: "1 1 auto",
                  backgroundColor: "#fff",
                  position: "relative",
                  border: "1px solid #d0cecf",
                  overflow: "auto",
                  width: "100%",
                  color: "#000",
                  userSelect: "text",
                  height: "260px",
                  borderTop: 0,
                }}
              >
                <table
                  ref={componentRef}
                  {...{
                    style: {
                      width: table.getCenterTotalSize(),
                      marginBottom: 10,
                    },
                  }}
                >
                  <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                      <tr
                        className="tbody-tr"
                        key={row.id}
                        style={
                          i % 2 !== 0
                            ? {
                                backgroundColor: "#f7f7f7",
                              }
                            : {
                                backgroundColor: "#fff",
                              }
                        }
                      >
                        {row.getVisibleCells().map((cell: any) => {
                          return (
                            <td
                              className={`${
                                cell.id !== row.id + "_actions"
                                  ? "td"
                                  : "td-empty"
                              }`}
                              {...{
                                key: cell.id,
                              }}
                            >
                              <div
                                {...{
                                  className:
                                    cell.column.columnDef.classNameBody,
                                }}
                                style={{
                                  width: cell.column.getSize(),
                                }}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  background: "none",
                  border: 0,
                  borderBottom: "3px solid #fff",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  position: "relative",
                  color: "#000",
                  flex: "0 0 auto",
                }}
                className="flex items-center gap-2"
              >
                <div
                  style={{
                    margin: "3px 3px 3px 0px",
                    float: "left",
                    width: "100%",
                    whiteSpace: "nowrap",
                    color: "#000",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      float: "left",
                      background: "none",
                      height: "24px",
                      margin: "0 5px 0 0",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                      color: "#000",
                    }}
                  >
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                      }}
                      style={{
                        minHeight: "24px",
                        padding: "0px 18px 0px .5rem",
                        border: "1px solid #B4B4B4",
                        borderRadius: "2px",
                        verticalAlign: "middle",
                        fontSize: "12px",
                        textAlign: "left",
                        textIndent: "0.01px",
                        textOverflow: "ellipsis",
                        backgroundColor: "#fff",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "100%",
                        backgroundImage:
                          "url(https://cms.wialon.us/static/skin/misc/ddn.svg)",
                        color: "#464646",
                        outline: "none",
                        appearance: "none",
                        cursor: "pointer",
                      }}
                    >
                      {[10, 20, 50, 100, 500, 1000].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    style={{
                      float: "left",
                      background: "none",
                      height: "24px",
                      margin: "0 5px",
                      verticalAlign: "middle",
                      whiteSpace: "nowrap",
                      color: "#000",
                    }}
                  >
                    {/* ICON */}
                    <div
                      className="prevAll"
                      onClick={() => table.setPageIndex(0)}
                      style={{
                        float: "left",
                        width: "22px",
                        height: "22px",
                        border: 0,
                        cursor: "pointer",
                        overflow: "hidden",
                        fontSize: "12px",
                        textAlign: "center",
                        paddingTop: "2px",
                        color: "#9b9c9c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>
                    <div
                      className="prev"
                      onClick={() => table.previousPage()}
                      style={{
                        float: "left",
                        width: "22px",
                        height: "22px",
                        border: 0,
                        cursor: "pointer",
                        overflow: "hidden",
                        fontSize: "12px",
                        textAlign: "center",
                        paddingTop: "2px",
                        color: "#9b9c9c",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    ></div>
                    <div
                      style={{
                        float: "left",
                        background: "none",
                        height: "24px",
                        margin: "0 5px",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                        color: "#000",
                      }}
                    >
                      <span
                        style={{ position: "relative", overflow: "visible" }}
                      >
                        <table>
                          <tbody>
                            <tr>
                              <td>
                                <b
                                  id="page"
                                  style={{ fontWeight: "normal" }}
                                  dir="auto"
                                >
                                  Página
                                </b>
                              </td>
                              <td>
                                <input
                                  style={{
                                    width: 62,
                                    fontSize: "12px",
                                    marginTop: "1px",
                                    padding: "0 5px",
                                    position: "relative",
                                    marginLeft: "8px",
                                    marginRight: "8px",
                                    minHeight: "24px",
                                    border: "1px solid #B4B4B4",
                                    borderRadius: "var(--button-border-radius)",
                                    textAlign: "left",
                                    fontFamily: "inherit",
                                    color: "#464646",
                                    resize: "none",
                                    outline: "none",
                                  }}
                                  type="number"
                                  value={
                                    table.getState().pagination.pageIndex + 1
                                  }
                                  onChange={(e) => {
                                    const page = e.target.value
                                      ? Number(e.target.value) - 1
                                      : 0;
                                    table.setPageIndex(page);
                                  }}
                                />
                              </td>
                              <td dir="auto">
                                <b id="of" style={{ fontWeight: "normal" }}>
                                  de{" "}
                                </b>
                                <span>{table.getPageCount()}</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </span>
                    </div>
                    <div
                      style={{
                        float: "left",
                        background: "none",
                        height: "24px",
                        margin: "0 5px",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                        color: "#000",
                      }}
                    >
                      <div
                        className="next"
                        onClick={() => table.nextPage()}
                        style={{
                          float: "left",
                          width: "22px",
                          height: "22px",
                          border: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          fontSize: "12px",
                          textAlign: "center",
                          paddingTop: "2px",
                          color: "#9b9c9c",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></div>
                      <div
                        className="nextAll"
                        onClick={() =>
                          table.setPageIndex(table.getPageCount() - 1)
                        }
                        style={{
                          float: "left",
                          width: "22px",
                          height: "22px",
                          border: 0,
                          cursor: "pointer",
                          overflow: "hidden",
                          fontSize: "12px",
                          textAlign: "center",
                          paddingTop: "2px",
                          color: "#9b9c9c",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></div>
                    </div>

                    <div
                      style={{
                        float: "left",
                        background: "none",
                        height: "24px",
                        margin: "0 5px",
                        verticalAlign: "middle",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <label>
                        Mostrando {dataQuery.rows[0].index} a{" "}
                        {dataQuery.rows[dataQuery.rows.length - 1].index} de{" "}
                        {(data as TEgreso[]).length} registros
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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

import { Chip, Stack } from "@mui/material";
import { formatDate, formatter } from "../utils/helpers/functions";

export const columnUsers = [
  {
    Header: "DATOS",
    columns: [
      {
        Header: "Nombre completo",
        accessor: "fullname",
      },
      {
        Header: "Rol",
        accessor: "role",
      },
    ],
  },
  {
    Header: "INFORMACIÓN",
    columns: [
      {
        Header: "Tipo de documento",
        accessor: "tipDocument",
      },
      {
        Header: "Nro. de documento",
        accessor: "nroDocument",
      },
      {
        Header: "Correo",
        accessor: "email",
      },
      {
        Header: "Creador",
        accessor: "owner",
      },
      {
        Header: "Estado",
        accessor: "status",
        Cell: ({ value }: any) => (
          <Stack
            direction="row"
            spacing={1}
            style={{ justifyContent: "center" }}
          >
            {value ? (
              <Chip label="Activo" color="success" />
            ) : (
              <Chip label="Inactivo" color="error" />
            )}
          </Stack>
        ),
      },
    ],
  },
];

export const columnRoles = [
  {
    Header: "Rol",
    accessor: "name",
  },
  {
    Header: "Descripción",
    accessor: "description",
  },
  {
    Header: "Creador",
    accessor: "creator",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: any) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnModules = [
  {
    Header: "Modulo",
    accessor: "name",
  },
  {
    Header: "Descripción",
    accessor: "description",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: any) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnResources = [
  {
    Header: "Permisos",
    accessor: "name",
  },
  {
    Header: "Descripción",
    accessor: "description",
  },
  {
    Header: "KEY",
    accessor: "key",
  },
];

export const columnIngreso = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "Fecha de ingreso",
    accessor: "fecha",
    Cell: ({ value }: { value: any }) =>
      formatDate(new Date(String(value)), false),
  },
  {
    Header: "Detalle de ingreso",
    accessor: "detalle_ingreso",
  },
  {
    Header: "Afiliado",
    accessor: "afiliado",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: { value: boolean }) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnEgreso = [
  {
    Header: "Fecha de egreso",
    accessor: "fecha",
    Cell: ({ value }: { value: any }) =>
      formatDate(new Date(String(value)), false),
  },
  {
    Header: "Nombre destinatario",
    accessor: "nombre_destinatario",
  },
  {
    Header: "Detalle del egreso",
    accessor: "detalle_egreso",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: { value: boolean }) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnAfiliado = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "DNI",
    accessor: "dni",
  },
  {
    Header: "Afiliado",
    accessor: "full_name",
  },
  {
    Header: "Proyecto",
    accessor: "proyecto",
  },
  {
    Header: "Puesto de trabajo",
    accessor: "puesto_trabajo",
  },
  {
    Header: "Situación del afiliado",
    accessor: "situacion_afiliado",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: { value: boolean }) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnGrupo = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "Grupo",
    accessor: "nombre",
  },
  {
    Header: "Descripción",
    accessor: "descripcion",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: { value: boolean }) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnPago = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "Concepto",
    accessor: "concepto",
  },
  {
    Header: "Importe",
    accessor: "importe",
  },
  {
    Header: "Estado",
    accessor: "status",
    Cell: ({ value }: { value: boolean }) => (
      <Stack direction="row" spacing={1} style={{ justifyContent: "center" }}>
        {value ? (
          <Chip label="Activo" color="success" />
        ) : (
          <Chip label="Inactivo" color="error" />
        )}
      </Stack>
    ),
  },
];

export const columnConsultaXpao = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "Afiliado",
    accessor: "afiliado",
  },
  {
    Header: "Pagos",
    accessor: "pagos",
    Cell: ({ value }: { value: { fecha: Date; importe: number }[] }) => {
      return (
        value?.map((a, i: number) => {
          return (
            <div key={i + 1}>
              {"Fecha: " +
                formatDate(new Date(String(a.fecha)), false) +
                " - Importe: S/" +
                formatter.format(a.importe)}
            </div>
          );
        }) || <></>
      );
    },
  },
];

export const columnConsultaPagos = [
  {
    Header: "#",
    accessor: "index",
  },
  {
    Header: "Afiliado",
    accessor: "afiliado",
  },
  {
    Header: "Pagos",
    accessor: "pagos",
    Cell: ({
      value,
    }: {
      value: { fecha: Date; importe: number; concepto: string }[];
    }) => {
      return (
        value?.map((a, i: number) => {
          return (
            <div
              key={i + 1}
              style={{ marginLeft: 20, marginBottom: 20, float: "left" }}
            >
              <strong>{a.concepto}</strong>
              <ul>
                <li>Fecha: {formatDate(new Date(String(a.fecha)), false)}</li>
                <li>Importe: {formatter.format(a.importe)}</li>
              </ul>
            </div>
          );
        }) || <></>
      );
    },
  },
];

import { Chip, Stack } from "@mui/material";
import { formatDate } from "../utils/helpers/functions";

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
    Header: "Fecha de ingreso",
    accessor: "fecha",
    Cell: ({ value }: { value: any }) =>
      formatDate(new Date(String(value)), false),
  },
  {
    Header: "Partido VS",
    accessor: "partido_vs",
  },
  {
    Header: "L / V",
    accessor: "local_visita",
  },
  {
    Header: "Fase copa Perú",
    accessor: "fase_copaPeru",
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
    Header: "Partido VS",
    accessor: "partido_vs",
  },
  {
    Header: "L / V",
    accessor: "local_visita",
  },
  {
    Header: "Fase copa Perú",
    accessor: "fase_copaPeru",
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

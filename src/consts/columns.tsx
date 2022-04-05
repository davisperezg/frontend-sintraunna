import { Chip, Stack } from "@mui/material";

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

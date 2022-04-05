import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteRole,
  getRole,
  getRoles,
  ppRoles,
  restoreRole,
} from "../../api/role";
import { Role } from "../../interface/Role";

const KEY = "roles";

interface ICreateParams {
  dataRole: Role;
  idUpdateData?: string;
}

interface IDelteParams {
  id: string;
}

interface IError {
  request: {
    response: string;
  };
}

export const useMutateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Role, IError, ICreateParams>(
    ({ dataRole, idUpdateData }) => ppRoles(dataRole, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (!res.role) {
          console.log("AcTUALIZA");
          queryClient.invalidateQueries([KEY]);
        } else {
          console.log("Crea");
          const { role } = res;
          queryClient.setQueryData([KEY], (prevRoles: any) =>
            prevRoles.concat(role)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useRoles = () => {
  return useQuery<Role[], IError>([KEY], getRoles);
};

export const useRole = (id: string) => {
  return useQuery<Role, IError>([KEY, id], () => getRole(id));
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => deleteRole(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestoreRol = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => restoreRole(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

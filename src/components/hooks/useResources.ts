import { useContext } from "react";
import {
  createResourceRole,
  getResourceByRol,
  getResources,
  getResourceByUser,
  createResourceUser,
} from "../../api/resource";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../stateManagement/context";

const KEY = "resources";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParamsRole {
  body: {
    role: string;
    resource: string[];
  };

  idUpdateData?: string;
}

interface ICreateParamsUser {
  body: {
    user: string;
    resource: string[];
  };

  idUpdateData?: string;
}

export const useAccess = () => {
  const { user } = useContext(AuthContext);
  const { role } = user;

  const { data, isLoading, error, isFetching } = useQuery([KEY, role._id], () =>
    getResourceByRol(role._id)
  );

  return [data, isLoading, error, isFetching];
};

export const useResourcesByRol = (id: string) => {
  return useQuery<any, IError>([KEY, id], () => getResourceByRol(id));
};

export const useResources = () => {
  return useQuery<any, IError>([KEY], () => getResources());
};

export const useMutateResourceRol = () => {
  const queryClient = useQueryClient();

  return useMutation<any, IError, ICreateParamsRole>(
    ({ body, idUpdateData }) => createResourceRole(body, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (!res.role) {
          queryClient.invalidateQueries([KEY]);
        } else {
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

export const useMutateResourceUser = () => {
  const queryClient = useQueryClient();

  return useMutation<any, IError, ICreateParamsUser>(
    ({ body, idUpdateData }) => createResourceUser(body, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (!res.user) {
          queryClient.invalidateQueries([KEY + "_users"]);
        } else {
          const { user } = res;
          queryClient.setQueryData([KEY + "_users"], (prevRoles: any) =>
            prevRoles.concat(user)
          );
          queryClient.invalidateQueries([KEY + "_users"]);
        }
      },
    }
  );
};

export const useResourcesByUser = (id: string) => {
  return useQuery<any, IError>([KEY + "_users", id], () =>
    getResourceByUser(id)
  );
};

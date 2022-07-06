import { useContext } from "react";
import {
  createResourceRole,
  getResourceByRol,
  getResources,
  getResourceByUser,
  createResourceUser,
  getResourcesToCRUD,
  getResourcesById,
  createResource,
} from "../../api/resource";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../stateManagement/context";
import { Permission } from "../../interface/Permission";

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

interface ICreateParamsResource {
  body: Permission;
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
  return useQuery(
    [KEY + "_your_permissions", user._id],
    () => getResourceByUser(user._id),
    {
      enabled: !!user._id,
    }
  );
};

export const useResourcesByRol = (id: string) => {
  return useQuery<any, IError>([KEY, id], () => getResourceByRol(id));
};

export const useResources = () => {
  return useQuery<any, IError>([KEY], () => getResources());
};

export const useResourcesByIdCrud = (id: string) => {
  return useQuery<any, IError>([KEY + "_crud", id], () => getResourcesById(id));
};

export const useResourcesToCrud = () => {
  return useQuery<any, IError>([KEY + "_crud"], () => getResourcesToCRUD());
};

export const useMuateResource = () => {
  const queryClient = useQueryClient();

  return useMutation<any, IError, ICreateParamsResource>(
    ({ body, idUpdateData }) => createResource(body, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (!res.created) {
          queryClient.invalidateQueries([KEY + "_crud"]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY + "_crud"], (prevResource: any) =>
            prevResource.concat(created)
          );
          queryClient.invalidateQueries([KEY + "_crud"]);
        }
      },
    }
  );
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

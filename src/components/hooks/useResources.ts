import { useContext } from "react";
import {
  createResource,
  getResourceByRol,
  getResources,
} from "../../api/resource";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "../../stateManagement/context";

const KEY = "resources";

interface IError {
  request: {
    response: string;
  };
}

interface ICreateParams {
  body: {
    role: string;
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

export const useMutateResource = () => {
  const queryClient = useQueryClient();

  return useMutation<any, IError, ICreateParams>(
    ({ body, idUpdateData }) => createResource(body, idUpdateData),
    {
      onSuccess: (res: any) => {
        console.log(res);
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

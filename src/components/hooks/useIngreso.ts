import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteIngreso,
  getIngreso,
  getIngresos,
  ppIngreso,
  restoreIngreso,
} from "../../api/ingreso";
import { Ingreso } from "../../interface/Ingreso";

const KEY = "ingresos";

interface ICreateParams {
  dataIngreso: Ingreso;
  idUpdateData?: string;
}

interface IDelteParams {
  id: string;
  motivo: string;
}

interface IError {
  request: {
    response: string;
  };
}

export const useMutateIngreso = () => {
  const queryClient = useQueryClient();

  return useMutation<Ingreso, IError, ICreateParams>(
    ({ dataIngreso, idUpdateData }) => ppIngreso(dataIngreso, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (res.updated) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY], (prevIngresos: any) =>
            prevIngresos.concat(created)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useIngresos = () => {
  return useQuery<Ingreso[], IError>([KEY], getIngresos);
};

export const useIngreso = (id: string) => {
  return useQuery<Ingreso, IError>([KEY, id], () => getIngreso(id));
};

export const useDeleteIngreso = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => deleteIngreso(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestoreIngreso = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => restoreIngreso(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

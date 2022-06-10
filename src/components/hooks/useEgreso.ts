import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteEgreso,
  getEgreso,
  getEgresos,
  ppEgreso,
  restoreEgreso,
} from "../../api/egreso";
import { Egreso } from "../../interface/Egreso";

const KEY = "egresos";

interface ICreateParams {
  dataEgreso: Egreso;
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

export const useMutateEgreso = () => {
  const queryClient = useQueryClient();

  return useMutation<Egreso, IError, ICreateParams>(
    ({ dataEgreso, idUpdateData }) => ppEgreso(dataEgreso, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (res.updated) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY], (prevEgresos: any) =>
            prevEgresos.concat(created)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useEgresos = () => {
  return useQuery<Egreso[], IError>([KEY], getEgresos);
};

export const useEgreso = (id: string) => {
  return useQuery<Egreso, IError>([KEY, id], () => getEgreso(id));
};

export const useDeleteEgreso = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => deleteEgreso(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestoreEgreso = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => restoreEgreso(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

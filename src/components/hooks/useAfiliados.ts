import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  deleteAfiliado,
  getAfiliado,
  getAfiliados,
  ppAfiliado,
  restoreAfiliado,
} from "../../api/afiliado";
import { Afiliado } from "../../interface/Afiliado";

const KEY = "afiliados";

interface ICreateParams {
  dataAfiliado: Afiliado;
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

export const useMutateAfiliado = () => {
  const queryClient = useQueryClient();

  return useMutation<Afiliado, IError, ICreateParams>(
    ({ dataAfiliado, idUpdateData }) => ppAfiliado(dataAfiliado, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (res.updated) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY], (prevAfiliados: any) =>
            prevAfiliados.concat(created)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const useAfiliados = () => {
  return useQuery<Afiliado[], IError>([KEY], getAfiliados);
};

export const useAfiliado = (id: string) => {
  return useQuery<Afiliado, IError>([KEY, id], () => getAfiliado(id));
};

export const useDeleteAfiliado = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => deleteAfiliado(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestoreAfiliado = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id, motivo }) => restoreAfiliado(id, motivo),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

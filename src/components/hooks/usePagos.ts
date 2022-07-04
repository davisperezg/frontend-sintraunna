import { deletePago, getPago, restorePago } from "./../../api/pago";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPagos, ppPagos } from "../../api/pago";
import { Pago } from "../../interface/Pago";

const KEY = "pagos";

interface ICreateParams {
  dataPago: Pago;
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

export const useMutatePago = () => {
  const queryClient = useQueryClient();

  return useMutation<Pago, IError, ICreateParams>(
    ({ dataPago, idUpdateData }) => ppPagos(dataPago, idUpdateData),
    {
      onSuccess: (res: any) => {
        if (res.updated) {
          queryClient.invalidateQueries([KEY]);
        } else {
          const { created } = res;
          queryClient.setQueryData([KEY], (prevPagos: any) =>
            prevPagos.concat(created)
          );
          queryClient.invalidateQueries([KEY]);
        }
      },
    }
  );
};

export const usePagos = () => {
  return useQuery<Pago[], IError>([KEY], getPagos);
};

export const usePago = (id: string) => {
  return useQuery<Pago, IError>([KEY, id], () => getPago(id));
};

export const useDeletePago = () => {
  const queryClient = useQueryClient();

  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => deletePago(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

export const useRestorePago = () => {
  const queryClient = useQueryClient();
  return useMutation<Boolean, IError, IDelteParams>(
    ({ id }) => restorePago(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([KEY]);
      },
    }
  );
};

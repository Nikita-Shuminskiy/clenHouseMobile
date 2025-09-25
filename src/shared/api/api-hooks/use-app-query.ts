import {
  QueryFunction,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { QueryKey } from "../constants/api-keys/query-key";

const useAppQuery = <
  TQueryFnData = unknown,
  TData = TQueryFnData,
  TError = any,
>(
  queryKey: QueryKey,
  queryParameters: unknown[],
  queryFunction: QueryFunction<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<TData, TError> =>
  useQuery<TQueryFnData, TError, TData>({
    queryKey: [queryKey, [...queryParameters]],
    queryFn: queryFunction,
    ...options,
  });

export { useAppQuery };

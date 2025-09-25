import { AxiosResponse } from "axios";

import { generateEndpoint } from "./generate-endpoint";
import { instance } from "../configs/config";
import { InheritedApiRequest, RequestParams } from "../types/native-types-api";

const get = async <TApiRequest extends InheritedApiRequest>(
  params: RequestParams<TApiRequest>,
): Promise<AxiosResponse<TApiRequest["response"]>> => {
  const { url, urlVariables, body, urlPrefix = "", urlParams } = params;

  const endpoint = generateEndpoint(url, urlVariables);

  return instance.get<TApiRequest["response"], TApiRequest["body"]>(
    `${urlPrefix}${endpoint}`,
    { params: urlParams, data: body },
  );
};

const post = async <TApiRequest extends InheritedApiRequest>(
  params: RequestParams<TApiRequest>,
): Promise<AxiosResponse<TApiRequest["response"]>> => {
  const {
    url,
    urlVariables,
    body,
    urlPrefix = "",
    urlParams,
    headers = undefined,
  } = params;

  const endpoint = generateEndpoint(url, urlVariables);

  return instance.post<TApiRequest["response"], TApiRequest["body"]>(
    `${urlPrefix}${endpoint}`,
    body,
    { params: urlParams, headers },
  );
};

const patch = async <TApiRequest extends InheritedApiRequest>(
  params: RequestParams<TApiRequest>,
): Promise<AxiosResponse<TApiRequest["response"]>> => {
  const { url, urlVariables, body, urlPrefix = "", urlParams } = params;

  const endpoint = generateEndpoint(url, urlVariables);

  return instance.patch<TApiRequest["response"], TApiRequest["body"]>(
    `${urlPrefix}${endpoint}`,
    body,
    { params: urlParams },
  );
};

const put = async <TApiRequest extends InheritedApiRequest>(
  params: RequestParams<TApiRequest>,
): Promise<AxiosResponse<TApiRequest["response"]>> => {
  const { url, urlVariables, body, urlPrefix = "", urlParams } = params;

  const endpoint = generateEndpoint(url, urlVariables);

  return instance.put<TApiRequest["response"], TApiRequest["body"]>(
    `${urlPrefix}${endpoint}`,
    body,
    { params: urlParams },
  );
};

const deleteMethod = async <TApiRequest extends InheritedApiRequest>(
  params: RequestParams<TApiRequest>,
): Promise<AxiosResponse<TApiRequest["response"]>> => {
  const { url, urlVariables, body, urlPrefix = "", urlParams } = params;

  const endpoint = generateEndpoint(url, urlVariables);

  return instance.delete<TApiRequest["response"], TApiRequest["body"]>(
    `${urlPrefix}${endpoint}`,
    { params: urlParams, data: body },
  );
};

export const api = {
  get,
  post,
  put,
  patch,
  delete: deleteMethod,
};

import { API_ENDPOINTS } from "../constants/api-endpoints";

type Primitive = string | number | symbol;

type GenericObject = Record<Primitive, unknown>;

/**
 * NestedPaths
 * Get all the possible paths of an object
 * @example
 * type Keys = NestedPaths<{ a: { b: { c: string } }>
 * // 'a' | 'a.b' | 'a.b.c'
 */
type NestedPaths<T extends GenericObject, Path extends string = ""> = {
  [K in keyof T]: T[K] extends GenericObject
    ?
        | `${Path}${Path extends "" ? "" : "."}${K & string}`
        | NestedPaths<T[K], `${Path}${Path extends "" ? "" : "."}${K & string}`>
    : `${Path}${Path extends "" ? "" : "."}${K & string}`;
}[keyof T];

/**
 * StringNestedPaths
 * Get all the possible paths of an object which have string type
 * @example
 * type Keys = StringNestedPaths<{ a: { b: { c: string } }>
 * // 'a.b.c'
 */
type StringNestedPaths<T extends GenericObject> = NestedPaths<T> extends infer D
  ? Extract<D, string>
  : never;

/**
 * TypeFromPath
 * Get the type of the element specified by the path
 * @example
 * type TypeOfAB = TypeFromPath<{ a: { b: { c: string } }, 'a.b'>
 * // { c: string }
 */
export type TypeFromPath<
  T extends GenericObject,
  Path extends string // Or, if you prefer, NestedPaths<T>
> = {
  [K in Path]: K extends keyof T
    ? T[K]
    : K extends `${infer P}.${infer S}`
    ? T[P] extends GenericObject
      ? TypeFromPath<T[P], S>
      : never
    : never;
}[Path];

/**
 * StringNestedPaths
 * Get all the possible paths of an object which have string type
 * @example
 * type Keys = StringNestedPaths<{ a: { b: { c: string } }>
 * // 'a.b.c'
 */

type ApiObjectPath = StringNestedPaths<typeof API_ENDPOINTS>;

export type ApiRequest<
  TUrlApiObjectPath extends ApiObjectPath,
  TUrlVariables,
  TBody,
  TResponse
> = {
  urlApiObjectPath: TUrlApiObjectPath | any;
  urlVariables?: TUrlVariables;
  urlParams?: GenericObject;
  urlPrefix?: string;
  body?: TBody;
  response: TResponse;
  headers?: any;
};

export type InheritedApiRequest = ApiRequest<any, any, any, any>;

export type RequestParams<TApiRequest extends InheritedApiRequest> = {
  url: TypeFromPath<typeof API_ENDPOINTS, TApiRequest["urlApiObjectPath"]>;
  urlVariables?: TApiRequest["urlVariables"];
  urlParams?: any;
  urlPrefix?: string;
  body?: TApiRequest["body"];
  headers?: TApiRequest["headers"];
};

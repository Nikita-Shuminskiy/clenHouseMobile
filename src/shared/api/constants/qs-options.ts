import { IStringifyOptions } from "qs";

export const QS_OPTIONS: IStringifyOptions = {
  encode: false,
  allowDots: true as any,
  arrayFormat: "indices",
};

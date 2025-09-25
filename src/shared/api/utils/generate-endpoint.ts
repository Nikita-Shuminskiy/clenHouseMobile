export const generateEndpoint = (
  path: string,
  params: Record<string, unknown> = {},
): string =>
  path.replace(/:(\w+)/g, (_, key: string): string => params[key] as string);

/*
import { getPageview } from "@waline/api";

export const getServerURL = (serverURL: string): string => {
  const result = removeEndingSplash(serverURL);

  return isLinkHttp(result) ? result : `https://${result}`;
};

export const removeEndingSplash = (content = ''): string =>
  content.replace(/\/$/u, '');

export const isLinkHttp = (link: string): boolean =>
  /^(https?:)?\/\//.test(link);

export const errorHandler = (err: Error): void => {
  if (err.name !== 'AbortError') console.error(err.message);
};
*/
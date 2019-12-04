import * as url from 'url';

export interface IOnpremiseTmgCredentials {
  username: string;
  password: string;
  curl: string;
  tmg: boolean;
}

export function isOnPremUrl(siteUrl: string): boolean {
  let host: string = (url.parse(siteUrl)).host;
  return host.indexOf('.sharepoint.com') === -1 && host.indexOf('.sharepoint.cn') === -1 && host.indexOf('.sharepoint.de') === -1
    && host.indexOf('.sharepoint-mil.us') === -1 && host.indexOf('.sharepoint.us') === -1;
}

export function isTmgCredentialsOnpremise(siteUrl: string, T: IOnpremiseTmgCredentials): T is IOnpremiseTmgCredentials {
  let isOnPrem: boolean = isOnPremUrl(siteUrl);

  if (isOnPrem && (T as IOnpremiseTmgCredentials).username !== undefined && (T as IOnpremiseTmgCredentials).tmg) {
    return true;
  }

  return false;
}

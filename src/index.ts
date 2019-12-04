import * as Promise from 'bluebird';

import { IAuthResponse } from './auth/IAuthResponse';
import { IOnpremiseTmgCredentials } from './auth/IAuthOptions';
import { AuthResolverFactory } from './auth/AuthResolverFactory';

export function getAuth(url: string, options?: IOnpremiseTmgCredentials): Promise<IAuthResponse> {
  return AuthResolverFactory.resolve(url, options).getAuth();
}

export * from './auth/IAuthOptions';
export * from './auth/IAuthResponse';
export { setup, IConfiguration } from './config';

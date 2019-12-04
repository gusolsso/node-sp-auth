import { IOnpremiseTmgCredentials } from './IAuthOptions';
import { IAuthResolver } from './IAuthResolver';
import { OnpremiseTmgCredentials } from './resolvers/OnpremiseTmgCredentials';

import * as authOptions from './IAuthOptions';
import { FileConfig } from './resolvers/FileConfig';

export class AuthResolverFactory {
  public static resolve(siteUrl: string, options?: IOnpremiseTmgCredentials): IAuthResolver {

    if (!options) {
      return new FileConfig(siteUrl);
    }

    if (authOptions.isTmgCredentialsOnpremise(siteUrl, options)) {
      return new OnpremiseTmgCredentials(siteUrl, options);
    }

    throw new Error('Error while resolving authentication class');
  }
}

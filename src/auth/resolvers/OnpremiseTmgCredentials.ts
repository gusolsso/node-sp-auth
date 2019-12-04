import * as Promise from 'bluebird';
import * as url from 'url';
import { request } from './../../config';
import * as http from 'http';
import * as https from 'https';

import { IAuthResolver } from './../IAuthResolver';
import { IAuthResponse } from './../IAuthResponse';
import { Cache } from './../../utils/Cache';
import { IOnpremiseTmgCredentials } from './../IAuthOptions';

export class OnpremiseTmgCredentials implements IAuthResolver {
  private static CookieCache: Cache = new Cache();
  private TmgAuthEndpoint = 'CookieAuth.dll?Logon';

  constructor(private _siteUrl: string, private _authOptions: IOnpremiseTmgCredentials) { }

  public getAuth(): Promise<IAuthResponse> {

    let parsedUrl: url.Url = url.parse(this._siteUrl);
    let host: string = parsedUrl.host;
    let cacheKey = `${host}@${this._authOptions.username}@${this._authOptions.password}`;
    let cachedCookie: string = OnpremiseTmgCredentials.CookieCache.get<string>(cacheKey);

    if (cachedCookie) {
      return Promise.resolve({
        headers: {
          'Cookie': cachedCookie
        }
      });
    }

    let tmgEndPoint = `${parsedUrl.protocol}//${host}/${this.TmgAuthEndpoint}`;

    let isHttps: boolean = url.parse(this._siteUrl).protocol === 'https:';

    let keepaliveAgent: any = isHttps ?
      new https.Agent({ keepAlive: true, rejectUnauthorized: false }) :
      new http.Agent({ keepAlive: true });

    return request({
      url: tmgEndPoint,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `stage=useridandpasscode&flags=0&sessionid=%40%40SESSIONID&forcedownlevel=0&formdir=5&trusted=4&chkBsc=&` +
        `curl=${encodeURIComponent(this._authOptions.curl)}&` +
        `userid=${encodeURIComponent(this._authOptions.username)}&` +
        `password=${encodeURIComponent(this._authOptions.password)}&` +
        `passcode=${encodeURIComponent(this._authOptions.password)}`,
      agent: keepaliveAgent,
      json: false,
      simple: false,
      resolveWithFullResponse: true,
      strictSSL: false
    } as any)
      .then((response: any) => {

        let authCookie = response.headers['set-cookie'][0];

        return {
          headers: {
            'Cookie': authCookie
          }
        };

      }) as Promise<IAuthResponse>;
  }
}

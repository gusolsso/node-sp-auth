# sp-auth - nodejs to SharePoint unattended http authentication 

`sp-auth` allows you to perform SharePoint unattended (without user interaction) http authentication with nodejs. `sp-auth` also takes care about caching authentication data for performance (no need for you to think about how long authentication will be available, that's a task for `sp-auth`, as soon as authentication will be expired, `sp-auth` will renew it internally).    
This is a fork from the original repository [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth). 
Where un-needed functionality has been removed, and some customization has been made to better work with FMV sharepoint projects. 
For projects which needs a proxy, use [sp-rest-proxy](https://git.haxakon.se/fmv/sp-rest-proxy)

Versions supported:
 * SharePoint 2013 and onwards

Authentication options:
 * SharePoint 2013 and onwards:
   * Forefront TMG authentication

---

### How to use:

#### Create authentication headers and perform http request:

```javascript
import * as spauth from 'node-sp-auth';
import * as request from 'request-promise';

//get auth options
spauth.getAuth(url, credentialOptions)
  .then(options => {

    //perform request with any http-enabled library (request-promise in a sample below):
    let headers = options.headers;
    headers['Accept'] = 'application/json;odata=verbose';

    request.get({
      url: 'https://[your tenant].sharepoint.com/sites/dev/_api/web',
      headers: headers
    }).then(response => {
      //process data
    });
  });
```

## API:
### getAuth(url, credentialOptions)
#### return value:
Promise resolving into object with following properties:
 - `headers` - http headers (normally contain `Authorization` header, may contain any other heraders as well)
 - `options` - any additional options you may need to include for succesful request. For example, in case of on premise user credentials authentication, you need to set `agent` property on corresponding http client

#### params:
 - `url` - required, string, url to SharePoint site, `https://sp2013/sites/dev/` or `https:/[your tenant].sharepoint.com/sites/dev/`

 - SharePoint on premise (2013, 2016):
    - User credentials for Forefront TMG (reverse proxy):  
      `username`, `password`, `curl`, `tmg` = true

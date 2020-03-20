import { Injectable } from '@angular/core';

// Read settings from package.json
import { easywebSettings } from './package.json';

// See server.ts for __non_webpack_require__ explanation
declare const __non_webpack_require__: NodeRequire;
const fetch = __non_webpack_require__("node-fetch"); 

@Injectable({
  providedIn: 'root'
})

export default class EasywebApiClient {

  private apiBaseUri: string = "https://omega.easyweb.se" 

  // OAuth2-parameters
  private clientID: string;
  private clientSecret: string;
  private clientURL: string;
  private clientScope: string = "Easyweb.ExternalApi";

  // Token endpoint
  private tokenEndpoint: string = "/connect/token";

  // Token storage
  public currentTokenExpiration: number = 0;
  public currentToken: string;

  // Whether we are refreshing a token that resulted in a 301-response when used
  private tokenRefreshing: boolean = false;

  constructor() {

    this.clientID = easywebSettings.clientID;

    this.clientID = easywebSettings.clientID;
    this.clientSecret = easywebSettings.clientSecret;
    this.clientURL = easywebSettings.clientURL;
    this.clientScope = easywebSettings.clientScope;

    this.apiBaseUri = this.clientURL.split("/extapi/")[0];
  }

  // Returns a token from the token endpoint unless an unexpired one already exists
  //
  async getToken() {
    if (this.currentTokenExpiration > 0 && this.currentToken) {
      var currentDate = Date.now();
      if (this.currentTokenExpiration < currentDate) {
        return this.currentToken;
      }
    }

    // Url and authentication headers to use when requesting token
    //
    var tokenEndpointUri = this.apiBaseUri + this.tokenEndpoint;
    var auth = "Basic " + Buffer.from(this.clientID + ":" + this.clientSecret).toString("base64")

    // Fetch token response with OAuth2-client credentials body
    //
    var tokenResponse = await fetch(
      tokenEndpointUri,
      {
        method: "POST",
        headers: {
          "Authorization": auth,
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "client_id=" + this.clientID + "&client_secret=" + this.clientSecret + "&grant_type=client_credentials&scope=" + this.clientScope
      });

    // Read json
    var tokenObject = await tokenResponse.json();

    // Set token to current instance
    this.currentToken = tokenObject.access_token;

    // Find when token expires
    var expiresIn = tokenObject.expires_in;

    // Set expiration date to current instance
    this.currentTokenExpiration = Date.now() + expiresIn;

    console.log("Din token, ers nåd: ", tokenObject.access_token);
    return tokenObject.access_token;
  }

  // Fetch a response from the Easyweb API with local path
  //
  public async fetch(apiPath: string) {
    // Get token to authorize ourselves
    var token = await this.getToken();

    // Send request with Bearer auth-headers
    var apiResponse = await fetch(
      this.clientURL + apiPath,
      {
        headers: { 'Authorization': 'Bearer ' + token }
      });

    // If token expired or reset before it should, try calling with a reset token
    if (apiResponse.status === 401 && this.currentTokenExpiration > 0 && !this.tokenRefreshing) {
      this.tokenRefreshing = true;
      this.currentTokenExpiration = 0;
      this.currentToken = "";
      return await fetch(apiPath);
    }
    this.tokenRefreshing = false;

    return apiResponse;
  }
}

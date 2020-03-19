import fetch from "isomorphic-unfetch";
import pjson from "./package.json";

export default async function getEasywebData(apiPath) {
  let clientId = pjson.easywebSettings.clientID;
  let secret = pjson.easywebSettings.clientSecret;
  var apiURL = pjson.easywebSettings.clientURL;

  var auth = "Basic " + Buffer.from(clientId + ":" + secret).toString("base64");

  var fullUrl = apiURL + apiPath; // Ladda på route på vår url. Man kan tänka sig enundermapp med [folder]

  // Ex. Get token
  //
  var getToken = async function(clientId, secret) {
    var rawURL = apiURL.split("/extapi/")[0];
    var tokenResponse = await fetch(rawURL + "/connect/token", {
      method: "POST",
      headers: {
        Authorization: auth,
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body:
        "client_id=" +
        clientId +
        "&client_secret=" +
        secret +
        "&grant_type=client_credentials&scope=Easyweb.ExternalApi"
    });

    var tokenObject = await tokenResponse.json();

    // Store token och mät när ny behövs m.h.a. denna (sekunder)
    var expiresIn = tokenObject.expires_in;

    console.log("Din token, maestro: ", tokenObject.access_token);
    return tokenObject.access_token;
  };

  var token = await getToken();

  // Ex. Call with token
  var apiCall = async function() {
    var apiResponse = await fetch(fullUrl, {
      headers: { Authorization: "Bearer " + token }
    });
    return await apiResponse.json();
  };

  // ex. Fetch data from external API
  //
  const data = await apiCall();
  console.log(data);

  return data;
}

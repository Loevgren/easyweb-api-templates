import fetch from 'isomorphic-unfetch'

const Page = ({ data }) => {
  return <div><p>Page urlname: {data.urlname}</p><p>Id: {data.id}</p></div>
}


// This gets called on every request
export async function getServerSideProps(ctx) {

// Simple example to illustrate token call
//
let clientId = "OAuth2.u0000.h000";
let secret = "";

var auth = "Basic " + new Buffer(clientId + ":" + secret).toString("base64")
    
    var apiUrl = "https://omega.easyweb.se/";
    var apiExt = "extapi/0000"
    var fullUrl = apiUrl + apiExt + "/routes/" + ctx.params.urlname; // Ladda på route på vår url. Man kan tänka sig enundermapp med [folder]

    // Ex. Get token
    //
    var getToken = async function (clientId, secret) {
        var tokenResponse = await fetch(
            apiUrl + "connect/token",
            {
            method: "POST",
            headers: {
                "Authorization": auth,
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "client_id=" + clientId + "&client_secret=" + secret + "&grant_type=client_credentials&scope=Easyweb.ExternalApi"
        });
        
        var tokenObject = await tokenResponse.json();
        
        // Store token och mät när ny behövs m.h.a. denna (sekunder)
        var expiresIn = tokenObject.expires_in;
        
        console.log("Din token, maestro: ", tokenObject.access_token);
        return tokenObject.access_token;
    }
    
    var token = await getToken();
    
    // Ex. Call with token
    var apiCall = async function () {
        
        var apiResponse = await fetch(
            fullUrl,
            { headers: { 'Authorization': 'Bearer ' + token }
        });
        return await apiResponse.json();
    }
    
  // ex. Fetch data from external API
  //
  const data = await apiCall();
  console.log(data);

  // Pass data to the page via props
  return { props: { data } }
}

export default Page
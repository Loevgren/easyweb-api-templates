using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using IdentityModel.Client;
using System.Net.Http;

namespace CoregularEW
{
    public class EasywebApiClient
    {
        #region - Setup -
        #region - Init -
        public EasywebApiClient(IHttpClientFactory clientFactory, IOptions<EasywebApiSettings> options)
        {
            ClientFactory = clientFactory ?? throw new ArgumentException(nameof(IHttpClientFactory));
            Options = options?.Value ?? throw new ArgumentException(nameof(EasywebApiSettings));
        }

        protected IHttpClientFactory ClientFactory { get; }
        protected EasywebApiSettings Options { get; }

        protected DateTime? TokenExpiration { get; set; }
        protected string Token { get; set; }
        #endregion

        #region - Token -
        public async Task<string> GetToken()
        {
            if (!TokenExpiration.HasValue || DateTime.Now > TokenExpiration.Value || String.IsNullOrEmpty(Token))
            {
                using (var client = ClientFactory.CreateClient())
                {
                    var tokenResponse = await client.RequestClientCredentialsTokenAsync(new ClientCredentialsTokenRequest
                    {
                        Address = String.Join("/", Options.Authority.Trim('/'), Options.TokenEndpoint.Trim('/')),
                        ClientId = Options.ClientId,
                        ClientSecret = Options.ClientSecret,
                        Scope = Options.Scope
                    });

                    if (!tokenResponse.IsError)
                    {
                        TokenExpiration = DateTime.Now.AddSeconds(tokenResponse.ExpiresIn);
                        Token = tokenResponse.AccessToken;
                    }
                    return tokenResponse.AccessToken ?? tokenResponse.Error;
                }
            }
            return Token;
        }
        #endregion
        
        #region - General API-call -
        public async Task<HttpResponseMessage> FindDataAsync(string path)
        {
            var token = await GetToken();

            using (var client = ClientFactory.CreateClient())
            {
                client.SetBearerToken(token);
                return await client.GetAsync(String.Join("/", Options.Authority.Trim('/'), path));
            }
        }
        #endregion
        #endregion
    }
}

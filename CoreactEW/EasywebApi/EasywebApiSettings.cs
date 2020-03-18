using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoregularEW
{
    public class EasywebApiSettings
    {
        public string Authority { get; set; } = "https://omega.easyweb.se";

        // Identitet för den som ska ansluta
        public string ClientId { get; set; } = "OAuth2.u0000.h000";

        // Hemligheter
        public string ClientSecret { get; set; } = "clabbe";

        // Access-rights
        public string Scope { get; set; } = "Easyweb.ExternalApi";

        public string TokenEndpoint { get; set; } = "/connect/token";

        public string EndpointRoot { get; set; } = "https://omega.easyweb.se/extapi/0000";
    }
}

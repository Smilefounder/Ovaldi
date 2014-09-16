using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Ovaldi.Web.Areas.Import
{
    public class ChatHub : Hub
    {
        public static IDictionary<string, string> sessionConnections = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        public static string GetConnectionId(string sessionId)
        {
            if (sessionConnections.ContainsKey(sessionId))
            {
                return sessionConnections[sessionId];
            }
            return null;
        }
        public void Send(string name, string message)
        {
            // Call the broadcastMessage method to update clients.
            Clients.All.broadcastMessage(name, message);
        }
        public override Task OnDisconnected(bool stopCalled)
        {
            var sessionIdCookie = Context.RequestCookies["ASP.NET_SessionId"];
            if (sessionIdCookie != null)
            {
                var sessionId = sessionIdCookie.Value;
                if (!string.IsNullOrEmpty(sessionId) && sessionConnections.ContainsKey(sessionId))
                {
                    sessionConnections.Remove(sessionId);
                }
            }
            return base.OnDisconnected(stopCalled);
        }
        public override Task OnConnected()
        {
            var sessionIdCookie = Context.RequestCookies["ASP.NET_SessionId"];
            if (sessionIdCookie != null)
            {
                sessionConnections[sessionIdCookie.Value] = Context.ConnectionId;
            }

            return base.OnConnected();
        }
    }
}
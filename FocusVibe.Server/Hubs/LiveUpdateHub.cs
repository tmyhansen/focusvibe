using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class LiveUpdateHub : Hub
{
    public async Task SendUpdate(string entity, object data)
    {
        await Clients.All.SendAsync("ReceiveUpdate", entity, data);
    }
}
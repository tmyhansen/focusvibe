using FocusVibe.Server.Models;

namespace FocusVibe.Server.Interfaces
{
    public interface IAuthService
    {
        Task<string?> AuthenticateUser(string email, string password);
    }
}
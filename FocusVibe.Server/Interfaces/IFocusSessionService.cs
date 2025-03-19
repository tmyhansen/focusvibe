using FocusVibe.Server.Models;

namespace FocusVibe.Server.Interfaces
{
    public interface IFocusSessionService
    {
        Task<FocusSession?> GetCurrentSessionAsync();
        Task<FocusSession> StartSessionAsync(int userId, int motivationLevel);
        Task<FocusSession?> GetSessionByIdAsync(int sessionId);
        Task<FocusSession?> EndSessionAsync(int sessionId);
        Task<UserProgress> GetUserProgressAsync(int userId);
    }
}

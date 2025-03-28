using FocusVibe.Server.Models;

namespace FocusVibe.Server.Interfaces
{
    public interface IFocusSessionService
    {
        Task<FocusSession?> GetCurrentSessionAsync(int userId);
        Task<FocusSession> StartSessionAsync(int userId, int motivationLevel, int plannedDuration, string selectedTask);
        Task<FocusSession?> GetSessionByIdAsync(int sessionId);
        Task<FocusSession?> EndSessionAsync(int sessionId);
        Task<UserProgress> GetUserProgressAsync(int userId);
    }
}

using FocusVibe.Server.Models;

namespace FocusVibe.Server.Interfaces
{
    public interface IFocusSessionService
    {
        FocusSession GetCurrentSession();
        FocusSession StartSession(int motivationLevel);
        FocusSession GetSessionById(int sessionId);
        FocusSession EndSession(int sessionId);
        UserProgress GetUserProgress();
    }
}

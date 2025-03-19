using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;

namespace FocusVibe.Server.Services
{
    public class FocusSessionService : IFocusSessionService
    {
        private readonly List<FocusSession> _sessions = new List<FocusSession>();

        public FocusSession GetCurrentSession()
        {
            return _sessions.LastOrDefault(s => s.Status == FocusSessionStatus.InProgress);
        }

        public FocusSession StartSession(int motivationLevel)
        {
            var session = new FocusSession
            {
                Id = _sessions.Count + 1,
                MotivationLevel = motivationLevel,
                Status = FocusSessionStatus.InProgress,
                StartTime = DateTime.Now,
                WorkTime = 25,
                BreakTime = 5
            };

            _sessions.Add(session);
            return session;
        }

        public FocusSession GetSessionById(int sessionId)
        {
            return _sessions.FirstOrDefault(s => s.Id == sessionId);
        }

        public FocusSession EndSession(int sessionId)
        {
            var session = _sessions.FirstOrDefault(s => s.Id == sessionId);
            if (session != null)
            {
                session.Status = FocusSessionStatus.Completed;
                session.EndTime = DateTime.Now;
            }
            return session;
        }

        public UserProgress GetUserProgress()
        {
            return new UserProgress
            {
                TotalFocusTime = _sessions.Sum(s => s.WorkTime),
                TotalSessions = _sessions.Count,
                CurrentStreak = 5,
                MaxStreak = 10
            };
        }
    }
}

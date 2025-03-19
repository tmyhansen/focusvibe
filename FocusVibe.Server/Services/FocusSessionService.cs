using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using FocusVibe.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace FocusVibe.Server.Services
{
    public class FocusSessionService : IFocusSessionService
    {
        private readonly ApplicationDbContext _context;

        public FocusSessionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FocusSession?> GetCurrentSessionAsync()
        {
            return await _context.FocusSessions
                .OrderByDescending(s => s.StartTime)
                .FirstOrDefaultAsync(s => s.Status == FocusSessionStatus.InProgress);
        }

        public async Task<FocusSession> StartSessionAsync(int userId, int motivationLevel)
        {
            var session = new FocusSession
            {
                UserId = userId,
                MotivationLevel = motivationLevel,
                Status = FocusSessionStatus.InProgress,
                StartTime = DateTime.UtcNow,
                WorkTime = 25,
                BreakTime = 5
            };

            _context.FocusSessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<FocusSession?> GetSessionByIdAsync(int sessionId)
        {
            return await _context.FocusSessions.FindAsync(sessionId);
        }

        public async Task<FocusSession?> EndSessionAsync(int sessionId)
        {
            var session = await _context.FocusSessions.FindAsync(sessionId);
            if (session != null)
            {
                session.Status = FocusSessionStatus.Completed;
                session.EndTime = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
            return session;
        }

        public async Task<UserProgress> GetUserProgressAsync(int userId)
        {
            var sessions = await _context.FocusSessions.Where(s => s.UserId == userId).ToListAsync();

            return new UserProgress
            {
                TotalFocusTime = sessions.Sum(s => s.WorkTime),
                TotalSessions = sessions.Count,
                CurrentStreak = 5,
                MaxStreak = 10
            };
        }
    }
}

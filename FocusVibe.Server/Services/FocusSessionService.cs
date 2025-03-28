using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using FocusVibe.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace FocusVibe.Server.Services
{
    public class FocusSessionService : IFocusSessionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        private readonly IHubContext<LiveUpdateHub> _hubContext;

        public FocusSessionService(ApplicationDbContext context, IUserService userService, IHubContext<LiveUpdateHub> hubContext)
        {
            _context = context;
            _userService = userService;
            _hubContext = hubContext;
        }

        public async Task<FocusSession?> GetCurrentSessionAsync(int userId)
        {
            await UpdateSessionsOnClients();
            return await _context.FocusSessions
                .Where(s => s.UserId == userId && s.EndTime == null)
                .OrderByDescending(s => s.StartTime)
                .FirstOrDefaultAsync();
        }

        public async Task<FocusSession> StartSessionAsync(int userId, int motivationLevel, int plannedDuration, string selectedTask)
        {
            var session = new FocusSession
            {
                UserId = userId,
                MotivationLevel = motivationLevel,
                Status = 2,
                StartTime = DateTime.UtcNow,
                WorkTime = plannedDuration,
                BreakTime = 5,
                Task = selectedTask
            };

            _context.FocusSessions.Add(session);
            await _context.SaveChangesAsync();

            await UpdateSessionsOnClients();
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
                session.Status = 4;
                session.EndTime = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            await UpdateSessionsOnClients();
            return session;
        }

        private async Task UpdateSessionsOnClients()
        {
            var sessions = await _userService.GetUsersWithOpenSessionsAsync();
            await _hubContext.Clients.All.SendAsync("ReceiveSessionsUpdate", "SessionsUpdate", sessions); //TODO: move out + model
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

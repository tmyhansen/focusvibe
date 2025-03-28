using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Azure.Core;
using FocusVibe.Server.Data;
using FocusVibe.Server.DTOs;
using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace FocusVibe.Server.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IAuthService _authService;

        public UserService(ApplicationDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }
        public User? GetCurrentUser(string token)
        {
            return _authService.ValidateToken(token);
        }

        public async Task<UserDto?> GetUserDetailsAsync(int userId)
        {
            var user = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new UserDto
                {
                    Username = u.Username,
                    FollowersAmount = _context.Followers.Count(f => f.FollowedId == userId),
                    FollowingAmount = _context.Followers.Count(f => f.FollowerId == userId),
                    SessionsAmount = _context.FocusSessions.Count(fs => fs.UserId == userId)
                })
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.UserPreference)
                .Include(u => u.FocusSessions)
                .FirstOrDefaultAsync(u => u.Id == userId);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> UpdateUserAsync(int userId, User updatedUser)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return null;
            }

            user.Username = updatedUser.Username;
            user.Email = updatedUser.Email;
            user.UserPreference = updatedUser.UserPreference;

            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> FollowUserAsync(int followerId, int followedId)
        {
            if (followerId == followedId)
            {
                return false;
            }

            var existingFollow = await _context.Followers
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (existingFollow != null)
            {
                return false;
            }

            var follow = new Follower
            {
                FollowerId = followerId,
                FollowedId = followedId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Followers.Add(follow);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> UnfollowUserAsync(int followerId, int followedId)
        {
            var follow = await _context.Followers
                .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

            if (follow == null)
            {
                return false;
            }

            _context.Followers.Remove(follow);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<User>> GetUsersWithOpenSessionsAsync()
        {
            var usersWithOpenSessions = await _context.FocusSessions
                .Where(fs => fs.EndTime == null)
                .Join(_context.Users, fs => fs.UserId, u => u.Id, (fs, u) => new { u.Id, u.Username })
                .Distinct()
                .ToListAsync();

            var users = usersWithOpenSessions.Select(u => new User
            {
                Id = u.Id,
                Username = u.Username
            }).ToList();

            return users;
        }

    }
}

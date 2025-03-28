using FocusVibe.Server.DTOs;
using FocusVibe.Server.Models;

namespace FocusVibe.Server.Interfaces
{
    public interface IUserService
    {
        User? GetCurrentUser(string token);
        Task<UserDto?> GetUserDetailsAsync(int userId);
        Task<User?> GetUserByIdAsync(int userId);
        Task<User?> GetUserByEmailAsync(string email);
        Task<List<User>> GetAllUsersAsync();
        Task<User> CreateUserAsync(User user);
        Task<User?> UpdateUserAsync(int userId, User updatedUser);
        Task<bool> DeleteUserAsync(int userId);
        Task<bool> FollowUserAsync(int followerId, int followedId);
        Task<bool> UnfollowUserAsync(int followerId, int followedId);
        Task<IEnumerable<User>> GetUsersWithOpenSessionsAsync();
    }
}

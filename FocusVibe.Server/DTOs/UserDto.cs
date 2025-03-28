namespace FocusVibe.Server.DTOs
{
    public class UserDto
    {
        public string Username { get; set; } = string.Empty;
        public int FollowersAmount { get; set; }
        public int FollowingAmount { get; set; }
        public int SessionsAmount { get; set; }
    }
}

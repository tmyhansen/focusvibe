using System.ComponentModel.DataAnnotations.Schema;

namespace FocusVibe.Server.Models
{
    public class Follower
    {
        public int Id { get; set; }
        public int FollowerId { get; set; }
        public int FollowedId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("FollowerId")]
        public User FollowerUser { get; set; } = null!;

        [ForeignKey("FollowedId")]
        public User FollowedUser { get; set; } = null!;
    }
}

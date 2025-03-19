using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FocusVibe.Server.Models
{
    public class UserPreference
    {
        [Key]
        public int UserId { get; set; }

        public bool NotificationEnabled { get; set; } = true;
        public int PreferredWorkTime { get; set; } = 25;
        public int PreferredBreakTime { get; set; } = 5;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}

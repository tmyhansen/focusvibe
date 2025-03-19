using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FocusVibe.Server.Models
{
    public class UserPreference
    {
        [Key]
        public int UserId { get; set; }

        public bool EnableNotifications { get; set; } = true;
        public int WorkTime { get; set; } = 25;
        public int BreakTime { get; set; } = 5;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }
}

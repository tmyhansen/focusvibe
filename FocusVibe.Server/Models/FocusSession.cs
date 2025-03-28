using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FocusVibe.Server.Models
{
    public class FocusApp
    {
        public FocusSession? CurrentSession { get; set; }
        public string MotivationTip { get; set; } = string.Empty;
        public UserProgress? UserProgress { get; set; }
    }

    public class FocusSession
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int MotivationLevel { get; set; }

        [Required]
        public int WorkTime { get; set; }

        [Required]
        public int BreakTime { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        [Required]
        public int Status { get; set; } = 2;

        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        public ICollection<Distraction> Distractions { get; set; } = new List<Distraction>();

        public SessionFeedback? SessionFeedback { get; set; }
        public string Task { get; set; } = "";
    }

    public class UserProgress
    {
        public int TotalFocusTime { get; set; }
        public int TotalSessions { get; set; }
        public int CurrentStreak { get; set; }
        public int MaxStreak { get; set; }
    }

    public enum FocusSessionStatus
    {
        Pending = 1,
        InProgress = 2,
        Completed = 3,
        Paused = 4
    }
}

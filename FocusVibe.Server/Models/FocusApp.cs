namespace FocusVibe.Server.Models
{
    public class FocusApp
    {
        public FocusSession CurrentSession { get; set; }

        public string MotivationTip { get; set; }

        public UserProgress UserProgress { get; set; }
    }

    public class FocusSession
    {
        public int Id { get; set; }
        public int MotivationLevel { get; set; }
        public int WorkTime { get; set; }
        public int BreakTime { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public FocusSessionStatus Status { get; set; }
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

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FocusVibe.Server.Models
{
    public class SessionFeedback
    {
        [Key]
        public int SessionId { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;

        [ForeignKey("SessionId")]
        public FocusSession FocusSession { get; set; } = null!;
    }
}

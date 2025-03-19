using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FocusVibe.Server.Models
{
    public class Distraction
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SessionId { get; set; }

        [Required]
        [MaxLength(255)]
        public string DistractionType { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [ForeignKey("SessionId")]
        public FocusSession FocusSession { get; set; } = null!;
    }
}

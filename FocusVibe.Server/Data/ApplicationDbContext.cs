using FocusVibe.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace FocusVibe.Server.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        public DbSet<FocusSession> FocusSessions { get; set; }
        public DbSet<Distraction> Distractions { get; set; }
        public DbSet<SessionFeedback> SessionFeedback { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserPreference>()
                .HasOne(up => up.User)
                .WithOne(u => u.UserPreference)
                .HasForeignKey<UserPreference>(up => up.UserId);

            modelBuilder.Entity<FocusSession>()
                .HasOne(fs => fs.User)
                .WithMany(u => u.FocusSessions)
                .HasForeignKey(fs => fs.UserId);

            modelBuilder.Entity<Distraction>()
                .HasOne(d => d.FocusSession)
                .WithMany(fs => fs.Distractions)
                .HasForeignKey(d => d.SessionId);

            modelBuilder.Entity<SessionFeedback>()
                .HasOne(sf => sf.FocusSession)
                .WithOne(fs => fs.SessionFeedback)
                .HasForeignKey<SessionFeedback>(sf => sf.SessionId);
        }
    }
}

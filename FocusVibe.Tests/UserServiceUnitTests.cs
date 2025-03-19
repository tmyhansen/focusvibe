using Microsoft.EntityFrameworkCore;
using Xunit;
using System.Threading.Tasks;
using FocusVibe.Server.Data;
using FocusVibe.Server.Services;
using FocusVibe.Server.Models;

namespace FocusVibe.Server.Tests
{
    public class UserServiceTests
    {
        private ApplicationDbContext CreateInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "FocusVibeDb")
                .Options;
            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task CreateUserAsync_ShouldAddUser()
        {
            //Arrange
            var context = CreateInMemoryDbContext();
            var userService = new UserService(context);
            var newUser = new User { Username = "Testbruker", Email = "test@abc.com" };

            //Act
            var createdUser = await userService.CreateUserAsync(newUser);

            //Assert
            Assert.NotNull(createdUser);
            Assert.Equal("Testbruker", createdUser.Username);
            Assert.Equal("test@abc.com", createdUser.Email);

            var userInDb = await context.Users.FindAsync(createdUser.Id);
            Assert.NotNull(userInDb);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
        {
            //Arrange
            var context = CreateInMemoryDbContext();
            var userService = new UserService(context);
            var user = new User { Username = "Testbruker", Email = "test@abc.com" };
            context.Users.Add(user);
            await context.SaveChangesAsync();

            //Act
            var fetchedUser = await userService.GetUserByIdAsync(user.Id);

            //Assert

            Assert.NotNull(fetchedUser);
            Assert.Equal(user.Username, fetchedUser.Username);
            Assert.Equal(user.Email, fetchedUser.Email);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            //Arrange
            var context = CreateInMemoryDbContext();
            var userService = new UserService(context);

            //Act
            var fetchedUser = await userService.GetUserByIdAsync(34535);

            //Assert
            Assert.Null(fetchedUser);
        }

        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnListOfUsers()
        {
            //Arrange
            var context = CreateInMemoryDbContext();
            var userService = new UserService(context);

            var users = new[]
            {
                new User { Username = "Testbruker", Email = "test@abc.com" },
                new User { Username = "Testbruker2", Email = "test2@abc.com" }
            };
            await context.Users.AddRangeAsync(users);
            await context.SaveChangesAsync();

            //Act
            var userList = await userService.GetAllUsersAsync();

            //Assert
            Assert.Equal(2, userList.Count);
            Assert.Contains(userList, u => u.Username == "Testbruker");
            Assert.Contains(userList, u => u.Username == "Testbruker2");
        }
    }
}

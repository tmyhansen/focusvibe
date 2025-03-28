using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using FocusVibe.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace FocusVibe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        public UserController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpGet("current-user")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var token = Request.Cookies["auth_token"];
            var user = _authService.ValidateToken(token);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = await _userService.GetUserDetailsAsync(user.Id);
            if (userDto == null)
            {
                return NotFound();
            }

            return Ok(userDto);
        }

        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            var userDto = new
            {
                user.Username,
                user.Email,
            };

            return Ok(userDto);
        }

        [HttpPost("follow")]
        public async Task<IActionResult> FollowUser([FromBody] FollowRequest followRequest)
        {
            if (followRequest.FollowerId == 0 || followRequest.FollowedId == 0)
            {
                return BadRequest("Invalid user IDs");
            }

            var success = await _userService.FollowUserAsync(followRequest.FollowerId, followRequest.FollowedId);

            if (success)
            {
                return Ok("User followed successfully");
            }

            return BadRequest("Error following user");
        }

        [HttpPost("unfollow")]
        public async Task<IActionResult> UnfollowUser([FromBody] FollowRequest followRequest)
        {
            if (followRequest.FollowerId == 0 || followRequest.FollowedId == 0)
            {
                return BadRequest("Invalid user IDs");
            }

            var success = await _userService.UnfollowUserAsync(followRequest.FollowerId, followRequest.FollowedId);

            if (success)
            {
                return Ok("User unfollowed successfully");
            }

            return BadRequest("Error unfollowing user");
        }
    }

    public class FollowRequest
    {
        public int FollowerId { get; set; }
        public int FollowedId { get; set; }
    }
}

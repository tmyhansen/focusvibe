using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace FocusVibe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
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
    }
}

using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace FocusVibe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;
        public AuthController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        //TODO: UserController
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("check-auth")]
        public IActionResult CheckAuth()
        {
            var token = Request.Cookies["auth_token"];
            if (string.IsNullOrEmpty(token))
            {
                return Unauthorized("No token provided");
            }

            try
            {
                var user = _authService.ValidateToken(token);
                if (user == null)
                {
                    return Unauthorized("Invalid or expired token");
                }

                return Ok(new { message = "Authenticated", username = user.Username });
            }
            catch (Exception ex)
            {
                return Unauthorized($"Token validation failed: {ex.Message}");
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> LoginUserAsync([FromBody] UserLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(" Email and password are required");
            }

            try
            {
                var user = await _userService.GetUserByEmailAsync(request.Email);
                if (user == null)
                {
                    return Unauthorized("Invalid email or password");
                }

                var token = await _authService.AuthenticateUser(user.Email, request.Password);
                if (token == null)
                {
                    return Unauthorized("Invalid email or password");
                }

                Response.Cookies.Append("auth_token", token, new CookieOptions
                {
                    HttpOnly = true,
                    Secure = false,  //TODO: set true when https is configured
                    SameSite = SameSiteMode.Strict,
                    Expires = DateTime.UtcNow.AddHours(12)
                });

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error logging in user: {ex.Message}");
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                Response.Cookies.Delete("auth_token");

                return Ok("Logged out");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error logging out user: {ex.Message}");
            }
        }


        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUpUserAsync([FromBody] UserSignUpRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Username, Email, and Password are required");
            }

            try
            {
                //TODO: Add more security and checks; probably minimum 8 characters including number, upper and lower. Time to crack this will be 9.5 years. 
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var user = new User
                {
                    Username = request.Username,
                    Email = request.Email,
                    PasswordHash = passwordHash
                };

                var createdUser = await _userService.CreateUserAsync(user);

                return CreatedAtAction(nameof(GetUserById), new { id = createdUser.Id }, createdUser);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error registering user: {ex.Message}");
            }
        }
        public class UserLoginRequest
        {
            public required string Email { get; set; }
            public required string Password { get; set; }
        }

        public class UserSignUpRequest
        {
            public required string Username { get; set; }
            public required string Email { get; set; }
            public required string Password { get; set; }
        }
    }
}

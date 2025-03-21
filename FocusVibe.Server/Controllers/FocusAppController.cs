using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace FocusVibe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FocusAppController : ControllerBase
    {
        private readonly IFocusSessionService _focusSessionService;
        private readonly IUserService _userService;
        //TODO: private readonly IMotivationService _motivationService;

        //TODO: public FocusAppController(IFocusSessionService focusSessionService, IMotivationService motivationService, IUserService userService)
        public FocusAppController(IFocusSessionService focusSessionService, IUserService userService)
        {
            _focusSessionService = focusSessionService;
            _userService = userService;
            //TODO: _motivationService = motivationService;
        }

        //TODO: SessionController
        [HttpGet("session/current")]
        public async Task<IActionResult> GetCurrentSessionAsync()
        {
            var focusSession = await _focusSessionService.GetCurrentSessionAsync();
            if (focusSession == null)
            {
                return NotFound();
            }

            var user = await _userService.GetUserByIdAsync(focusSession.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            //TODO: var motivationTip = await _motivationService.GetMotivationTipAsync(focusSession.MotivationLevel);

            var response = new
            {
                focusSession,
                userPreferences = user.UserPreference,
                distractions = focusSession.Distractions,
                sessionFeedback = focusSession.SessionFeedback,
                //TODO: motivationTip
            };

            return Ok(response);
        }

        [HttpPost("session/start")]
        public async Task<IActionResult> StartFocusSessionAsync([FromBody] FocusSessionRequest request)
        {
            var token = Request.Cookies["auth_token"];

            var user = _userService.GetCurrentUser(token);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (request.MotivationLevel < 1 || request.MotivationLevel > 10)
            {
                return BadRequest("Motivation level must be between 1 and 10.");
            }

            var session = await _focusSessionService.StartSessionAsync(user.Id, request.MotivationLevel);
            return Ok(new { sessionId = session.Id });
        }

        [HttpGet("session/{sessionId}")]
        public async Task<IActionResult> GetSessionDetailsAsync(int sessionId)
        {
            var session = await _focusSessionService.GetSessionByIdAsync(sessionId);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(session);
        }

        [HttpPost("session/end/{sessionId}")]
        public async Task<IActionResult> EndFocusSessionAsync(int sessionId)
        {
            var session = await _focusSessionService.EndSessionAsync(sessionId);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(new { message = "Session ended successfully", sessionId });
        }

        [HttpGet("progress")]
        public async Task<IActionResult> GetProgressAsync([FromQuery] int userId)
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var progress = await _focusSessionService.GetUserProgressAsync(userId);
            return Ok(progress);
        }
    }

    public class FocusSessionRequest
    {
        public int UserId { get; set; }
        public int MotivationLevel { get; set; }
    }
}

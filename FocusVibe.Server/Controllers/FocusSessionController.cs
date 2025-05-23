using FocusVibe.Server.Interfaces;
using FocusVibe.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace FocusVibe.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FocusSessionController : ControllerBase
    {
        private readonly IFocusSessionService _focusSessionService;
        private readonly IUserService _userService;
        private readonly IHubContext<LiveUpdateHub> _hubContext;
        //TODO: private readonly IMotivationService _motivationService;

        //TODO: public FocusAppController(IFocusSessionService focusSessionService, IMotivationService motivationService, IUserService userService)
        public FocusSessionController(IFocusSessionService focusSessionService, IUserService userService, IHubContext<LiveUpdateHub> hubContext)
        {
            _focusSessionService = focusSessionService;
            _userService = userService;
            _hubContext = hubContext;
            //TODO: _motivationService = motivationService;
        }

        [HttpGet("session/current")]
        public async Task<IActionResult> GetCurrentSessionAsync()
        {
            var token = Request.Cookies["auth_token"];

            var user = _userService.GetCurrentUser(token);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var focusSession = await _focusSessionService.GetCurrentSessionAsync(user.Id);
            if (focusSession == null)
            {
                return NotFound();
            }

            //TODO: var motivationTip = await _motivationService.GetMotivationTipAsync(focusSession.MotivationLevel);

            var response = new
            {
                sessionId = focusSession.Id,
                startTime = focusSession.StartTime,
                plannedDuration = focusSession.WorkTime,
                selectedTask = focusSession.Task,
                motivationLevel = focusSession.MotivationLevel
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

            var session = await _focusSessionService.StartSessionAsync(user.Id, request.MotivationLevel, request.PlannedDuration, request.SelectedTask);

            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", "FocusSessionStarted", new
            {
                Username = user.Username,
            });
            
            return Ok(new { sessionId = session.Id, startTime = session.StartTime, plannedDuration = session.WorkTime,  selectedTask = session.Task, motivationLevel = session.MotivationLevel});
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
        public int MotivationLevel { get; set; }
        public int PlannedDuration { get; set; }
        public string SelectedTask { get; set; } = "Not defined";
    }
}

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
        //TODO: private readonly IMotivationService _motivationService;

        //TODO: public FocusAppController(IFocusSessionService focusSessionService, IMotivationService motivationService)
        public FocusAppController(IFocusSessionService focusSessionService)
        {
            _focusSessionService = focusSessionService;
            //TODO: _motivationService = motivationService;
        }

        //GET: /api/focusapp
        [HttpGet]
        public IActionResult GetCurrentSession()
        {
            var focusSession = _focusSessionService.GetCurrentSession();
            if (focusSession == null)
            {
                return NotFound();
            }

            //TODO: var motivationTip = _motivationService.GetMotivationTip(focusSession.MotivationLevel);
            var response = new
            {
                focusSession,
                //TODO: motivationTip
            };

            return Ok(response);
        }

        [HttpPost("start")]
        public IActionResult StartFocusSession([FromBody] FocusSessionRequest request)
        {
            if (request.MotivationLevel < 1 || request.MotivationLevel > 10)
            {
                return BadRequest("Motivation level must be between 1 and 10.");
            }

            var session = _focusSessionService.StartSession(request.MotivationLevel);
            return Ok(new { sessionId = session.Id });
        }

        [HttpGet("session/{sessionId}")]
        public IActionResult GetSessionDetails(int sessionId)
        {
            var session = _focusSessionService.GetSessionById(sessionId);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(session);
        }

        [HttpPost("end/{sessionId}")]
        public IActionResult EndFocusSession(int sessionId)
        {
            var session = _focusSessionService.EndSession(sessionId);
            if (session == null)
            {
                return NotFound();
            }

            return Ok(new { message = "Session ended successfully", sessionId = sessionId });
        }

        [HttpGet("progress")]
        public IActionResult GetProgress()
        {
            var progress = _focusSessionService.GetUserProgress();
            return Ok(progress);
        }
    }

    public class FocusSessionRequest
    {
        public int MotivationLevel { get; set; }
    }
}

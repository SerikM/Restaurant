using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Store.BusinessServices.DTOs;
using Store.BusinessServices.Implements;
using Store.BusinessServices.Interfaces;
using Store.Data.DataEntities;
using System.Collections.Generic;

namespace Store.Web.Controllers
{
    [Produces("application/json")]
    public class BookingController : Controller
    {
        private readonly IBookingService _bookingService;
        private readonly IConfiguration _configurationlService;

        public BookingController(
            IBookingService bookingService,
            IEmailService emailService,
            IConfiguration configurationService)
        {
            _bookingService = bookingService;
            _configurationlService = configurationService;
        }

        [HttpGet]
        public IActionResult AvailableDates()
        {
            var availableDates = _bookingService.GetAvailableDates();
            return Ok(new
            {
                availableDates = availableDates
            });
        }

        [HttpGet]
        public IActionResult AvailableHours(string selectedDate)
        {
            var availableHours = _bookingService.GetAvailableHours(selectedDate);
            return Ok(
                new
                {
                    availableHours = availableHours
                });
        }

        [HttpPost]
        public IActionResult Reserve([FromBody] ReserveModel model)
        {
            if (_bookingService.Reserve(model))
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}

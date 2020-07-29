using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Store.BusinessServices.Implements;
using Store.BusinessServices.Interfaces;

namespace Store.Web.Controllers
{
    [Produces("application/json")]
    public class WhatsonController : Controller
    {
        private IWhatsonService _whatsonService;
        public WhatsonController(IWhatsonService whatsonService)
        {
            _whatsonService = whatsonService;
        }

        public IActionResult GetEvents(int num, int current)
        {
            var events = _whatsonService.GetEvents(num, current);
            return Json(events);
        }
    }
}